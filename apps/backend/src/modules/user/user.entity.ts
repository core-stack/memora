import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Account } from '@/modules/account/account.entity';

@Entity('users')
export class User {
  @ApiProperty({ example: '2b0a9e10-1d83-4f61-8a3f-bfdc62131d4a' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Mayron Silva' })
  @Column({ length: 255, nullable: true })
  name?: string;

  @ApiProperty({ example: 'mayron@example.com' })
  @Column({ unique: true, type: 'text', nullable: true })
  email?: string;

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
  @Column({ name: 'role_id', type: 'varchar', length: 36 })
  roleId: string;

  @ApiProperty({ example: '2025-11-12T13:00:00Z' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ example: '2025-11-12T13:00:00Z' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // 🔗 Relations
  // @ManyToOne(() => Role, (role) => role.users, { eager: false })
  // @JoinColumn({ name: 'role_id' })
  // role: Role;

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];

  // @OneToMany(() => Invite, (invite) => invite.user)
  // invites: Invite[];

  // @OneToMany(() => Member, (member) => member.user)
  // members: Member[];

  // @OneToMany(() => VerificationToken, (token) => token.user)
  // verificationTokens: VerificationToken[];
}
