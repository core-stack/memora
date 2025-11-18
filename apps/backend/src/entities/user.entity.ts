import bcrypt from 'bcrypt';
import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { AccountEntity } from './account.entity';
import { InviteEntity } from './invite.entity';
import { MemberEntity } from './member.entity';
import { RoleEntity } from './role.entity';
import { VerificationTokenEntity } from './verification-token.entity';

@Entity('users')
export class UserEntity {
  @ApiProperty({ example: '2b0a9e10-1d83-4f61-8a3f-bfdc62131d4a' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Mayron Silva' })
  @Column({ length: 255 })
  name: string;

  @ApiProperty({ example: 'mayron@example.com' })
  @Column({ unique: true, type: 'text' })
  email: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  password?: string;

  @ApiProperty({ example: '2025-11-12T13:00:00Z' })
  @Column({ name: 'email_verified', type: 'timestamptz', nullable: true })
  emailVerified?: Date;

  @ApiProperty({ example: 'https://example.com/avatar.png' })
  @Column({ type: 'text', nullable: true })
  image?: string;

  @ApiProperty({ example: 'f41b4f7e-27b1-4569-a1cd-3bcb5f94a520' })
  @Column({ name: 'role_id' })
  roleId: string;

  @ApiProperty({ example: '2025-11-12T13:00:00Z' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ example: '2025-11-12T13:00:00Z' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ApiProperty({ type: () => RoleEntity, required: false })
  @ManyToOne(() => RoleEntity, (role) => role.users, { eager: false })
  @JoinColumn({ name: 'role_id' })
  role?: RoleEntity;

  @ApiProperty({ type: () => AccountEntity, required: false, isArray: true })
  @OneToMany(() => AccountEntity, (account) => account.user)
  accounts?: AccountEntity[];

  @ApiProperty({ type: () => InviteEntity, required: false, isArray: true })
  @OneToMany(() => InviteEntity, (invite) => invite.user)
  invites?: InviteEntity[];

  @ApiProperty({ type: () => MemberEntity, required: false, isArray: true })
  @OneToMany(() => MemberEntity, (member) => member.user)
  members?: MemberEntity[];

  @OneToMany(() => VerificationTokenEntity, (token) => token.user)
  verificationTokens?: VerificationTokenEntity[];

  constructor(user: Omit<Partial<UserEntity>, "password">) {
    Object.assign(this, user);
  }

  async setPassword(password: string) {
    this.password = await bcrypt.hash(password, 10);
    return this;
  }

  async comparePassword(password: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(password, this.password);
  }

  verifyEmail(verify: boolean = true) {
    this.emailVerified = verify ? new Date() : undefined;
    return this;
  }
}
