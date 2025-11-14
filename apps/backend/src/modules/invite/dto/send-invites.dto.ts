import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsUUID, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { InviteEntity } from "../invite.entity";
import { MemberEntity } from "@/modules/member/member.entity";

export class SendInviteItemDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsUUID()
  roleId: string;
}

export class SendInviteDto {
  @ApiProperty({ type: [SendInviteItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SendInviteItemDto)
  emails: SendInviteItemDto[];

  getEmails(): string[] {
    return this.emails.map(({ email }) => email);
  }
}

export class SendInviteResponseDto {
  @ApiProperty({ type: [InviteEntity] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InviteEntity)
  sendedInvites: InviteEntity[];

  @ApiProperty({ type: [InviteEntity] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InviteEntity)
  reSendedInvites: InviteEntity[];

  @ApiProperty({ type: [MemberEntity] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberEntity)
  alreadyInTenant: MemberEntity[];

  constructor(data: Partial<SendInviteResponseDto>) {
    Object.assign(this, data);
  }
}