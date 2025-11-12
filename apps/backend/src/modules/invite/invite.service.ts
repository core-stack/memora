import { ServiceOptions } from '@/generics/service.interface';
import { GenericTenantService } from '@/generics/tenant.service';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateInviteSchema, InviteSchema } from '@snipet/schemas';

import { CreateInviteEntity, InviteEntity } from './invite.entity';
import { InviteRepository } from './invite.repository';
import { MemberService } from '../member/member.service';
import moment from 'moment';
import { env } from '@/env';
import { TxManager } from '@/generics/tx-manager';
import { InjectQueue } from '@nestjs/bullmq';
import { JobType } from '@/jobs/types';
import { Queue } from 'bullmq';
import { EmailPayload, EmailTemplate } from '@/jobs/email/schemas';
import { TenantService } from '../tenant/tenant.service';
import { RoleEntity } from '../role/role.entity';
import { role } from '@/db/schema/role';
import { RoleService } from '../role/role.service';
import { UserService } from '../user/user.service';
import { randomUUID } from 'crypto';

@Injectable()
export class InviteService extends GenericTenantService<
  InviteSchema, CreateInviteSchema, Partial<InviteSchema>,
  InviteEntity, CreateInviteEntity
> {
  logger = new Logger(InviteService.name);

  constructor(
    protected repository: InviteRepository,
    private readonly memberService: MemberService,
    private readonly txManager: TxManager,
    private readonly tenantService: TenantService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
    @InjectQueue(JobType.SEND_EMAIL) private readonly sendMail: Queue<EmailPayload>,
  ) {
    super(repository);
  }

  async send(invites: CreateInviteSchema, opts?: ServiceOptions) {
    const tenantId = opts?.http?.params.shouldGetString("tenantId");
    if (!tenantId) throw new BadRequestException("tenantId is required");
    const tenant = await this.tenantService.findByID(tenantId, { tx: opts?.tx });
    if (!tenant) throw new NotFoundException("Tenant not found");

    const memberId = opts?.http?.auth.memberId;
    if (!memberId) throw new BadRequestException("memberId is required");

    const emails = invites.emails.map(email => email.email);

    // verify if exists member with email
    const membersWithEmail = await this.memberService.findByUserEmail(emails, { tx: opts?.tx });
    if (membersWithEmail && membersWithEmail.length > 0) {
      const existingEmails = membersWithEmail.map(m => m.user?.email).filter(email => email) as string[];
      if (existingEmails.every(email => emails.includes(email))) {
        throw new BadRequestException("Members already exist");
      }
    }

    // verify if exists invite with email
    const invitesWithEmail = await this.repository.findByEmail(emails, { tx: opts?.tx });
    const rolesCache: RoleEntity[] = [];
    //#region Re send invites
    if (invitesWithEmail && invitesWithEmail.length > 0) {
      for (const invite of invitesWithEmail) {
        const inviteWithEmail = invites.emails.find(email => email.email === invite.email);
        if (!inviteWithEmail) continue;
        if (!rolesCache.find(role => role.id === inviteWithEmail.roleId)) {
          const role = await this.roleService.findByID(inviteWithEmail.roleId, { tx: opts?.tx });
          if (!role) throw new NotFoundException("Role not found");
          rolesCache.push(role);
        }
        if (invite.expiresAt < new Date()) { // if invite is expired
          invite.expiresAt = moment().add(env.DEFAULT_INVITE_EXPIRES).toDate();
          await this.txManager.runOrCreate(opts?.tx, async (tx) => {
            await this.sendMail.add("", {
              template: EmailTemplate.INVITE,
              context: {
                tenantName: tenant.name,
                inviteUrl: `${env.FRONTEND_URL}/invite/${invite.id}`,
                role: rolesCache.find(role => role.id === inviteWithEmail.roleId)?.name ?? "",
                inviterName: opts?.http?.auth.session?.user.name ?? "",
                expirationDate: moment(invite.expiresAt).format("MM/DD/YYYY HH:mm"),
              },
              to: invite.email,
              subject: "You have been invited to " + tenant.name,
            });
            await this.repository.update(
              invite.id,
              { expiresAt: invite.expiresAt, roleId: inviteWithEmail.roleId },
              { tx }
            );
          });
        }
      }
    }
    //#endregion

    // send invites
    const emailsToInvite = invites.emails
      .filter(({ email }) => !invitesWithEmail?.find(invite => invite.email === email));

    for (const { email, roleId } of emailsToInvite) {
      const userWithEmail = await this.userService.findFirst({ filter: { email }});
      if (!rolesCache.find(role => role.id === roleId)) {
        const role = await this.roleService.findByID(roleId, { tx: opts?.tx });
        if (!role) throw new NotFoundException("Role not found");
        rolesCache.push(role);
      }
      await this.txManager.runOrCreate(opts?.tx, async (tx) => {
        const invite = await this.repository.create({
          email,
          expiresAt: moment().add(env.DEFAULT_INVITE_EXPIRES).toDate(),
          tenantId: tenant.id,
          roleId: rolesCache.find(role => role.id === roleId)?.id ?? "",
          creatorId: memberId,
          userId: userWithEmail?.id,
        }, { tx });

        await this.sendMail.add("", {
          template: EmailTemplate.INVITE,
          context: {
            tenantName: tenant.name,
            inviteUrl: `${env.FRONTEND_URL}/invite/${invite.id}`,
            role: rolesCache.find(role => role.id === roleId)?.name ?? "",
            inviterName: opts?.http?.auth.session?.user.name ?? "",
            expirationDate: moment(invite.expiresAt).format("MM/DD/YYYY HH:mm"),
          },
          to: invite.email,
          subject: "You have been invited to " + tenant.name,
        });
      })
    }
  }
}
