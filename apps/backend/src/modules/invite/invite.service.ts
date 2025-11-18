import { Queue } from 'bullmq';
import moment from 'moment';
import { EntityManager, In } from 'typeorm';

import { InviteEntity } from '@/entities/invite.entity';
import { env } from '@/env';
import { EmailPayload, EmailTemplate } from '@/jobs/email/schemas';
import { JobType } from '@/jobs/types';
import { Service } from '@/shared/service';
import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { RoleEntity, RoleScope } from '../../entities/role.entity';
import { MemberService } from '../member/member.service';
import { RoleService } from '../role/role.service';
import { TenantService } from '../tenant/tenant.service';
import { UserService } from '../user/user.service';
import { SendInviteDto, SendInviteResponseDto } from './dto/send-invites.dto';

@Injectable()
export class InviteService extends Service<InviteEntity> {
  logger = new Logger(InviteService.name);
  entity = InviteEntity;

  @Inject() private readonly memberService: MemberService;
  @Inject() private readonly tenantService: TenantService;
  @Inject() private readonly roleService: RoleService;
  @Inject() private readonly userService: UserService;
  @InjectQueue(JobType.SEND_EMAIL) private readonly sendMail: Queue<EmailPayload>;

  async send(invites: SendInviteDto, manager?: EntityManager) {
    const tenantId = this.context.params.shouldGetString("tenantId");

    const tenant = await this.tenantService.findByID(tenantId, { manager });
    if (!tenant) throw new NotFoundException("Tenant not found");

    const memberId = this.context.memberId;
    if (!memberId) throw new NotFoundException("memberId is required");

    const sendedInvites: InviteEntity[] = [];
    const reSendedInvites: InviteEntity[] = [];

    // verify if exists member with email
    const alreadyInTenant = await this.memberService.findByUserEmail(tenantId, invites.getEmails(), manager);

    // remove already in tenant
    invites.emails = invites.emails.filter(
      ({ email }) => !alreadyInTenant.some(member => member.user?.email === email)
    );

    // verify if exists invite with email
    const invitesWithEmail = await this.repository(manager).find({
      where: { email: In(invites.getEmails()), tenantId }
    });

    const rolesCache: RoleEntity[] = [];
    //#region Re send invites
    if (invitesWithEmail && invitesWithEmail.length > 0) {
      for (const invite of invitesWithEmail) {
        const inviteWithEmail = invites.emails.find(email => email.email === invite.email);
        if (!inviteWithEmail) continue;
        if (!rolesCache.find(role => role.id === inviteWithEmail.roleId)) {
          const role = await this.roleService.findUnique({
            where: {
              id: inviteWithEmail.roleId,
              scope: RoleScope.TENANT,
              tenantId
            }
          }, manager);

          if (!role) throw new NotFoundException("Role not found");
          rolesCache.push(role);
        }

        // if invite is expired
        if (invite.expiresAt < new Date()) {
          invite.expiresAt = moment().add(env.DEFAULT_INVITE_EXPIRES).toDate();
          await this.transaction(async (manager) => {
            await this.sendMail.add("", {
              template: EmailTemplate.INVITE,
              context: {
                tenantName: tenant.name,
                inviteUrl: `${env.FRONTEND_URL}/invite/${invite.id}`,
                role: rolesCache.find(role => role.id === inviteWithEmail.roleId)?.name ?? "",
                inviterName: this.context.user?.name ?? '',
                expirationDate: moment(invite.expiresAt).format("MM/DD/YYYY HH:mm"),
              },
              to: invite.email,
              subject: "You have been invited to " + tenant.name,
            });
            await this.repository(manager).update(
              invite.id,
              invite.setExpiresAt().setRoleId(inviteWithEmail.roleId),
            );
            reSendedInvites.push(invite);
          }, manager);
        }
      }
    }
    //#endregion

    // send invites
    invites.emails = invites.emails.filter(
      ({ email }) => !invitesWithEmail?.find(invite => invite.email === email)
    );

    for (const { email, roleId } of invites.emails) {
      const userWithEmail = await this.userService.findFirst({ where: { email }}, manager);
      if (!rolesCache.find(role => role.id === roleId)) {
        const role = await this.roleService.findByID(roleId, { manager });
        if (!role) throw new NotFoundException("Role not found");
        rolesCache.push(role);
      }
      await this.transaction(async (manager) => {
        const invite = await this.repository(manager).save({
          email,
          expiresAt: moment().add(env.DEFAULT_INVITE_EXPIRES).toDate(),
          tenantId: tenant.id,
          roleId: rolesCache.find(role => role.id === roleId)?.id ?? "",
          creatorId: memberId,
          userId: userWithEmail?.id,
        });

        await this.sendMail.add("", {
          template: EmailTemplate.INVITE,
          context: {
            tenantName: tenant.name,
            inviteUrl: `${env.FRONTEND_URL}/invite/${invite.id}`,
            role: rolesCache.find(role => role.id === roleId)?.name ?? "",
            inviterName: this.context.user?.name ?? '',
            expirationDate: moment(invite.expiresAt).format("MM/DD/YYYY HH:mm"),
          },
          to: invite.email,
          subject: "You have been invited to " + tenant.name,
        });

        sendedInvites.push(invite);
      })
    }

    return new SendInviteResponseDto({
      sendedInvites,
      reSendedInvites,
      alreadyInTenant
    });
  }
}
