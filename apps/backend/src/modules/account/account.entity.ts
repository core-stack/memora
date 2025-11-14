import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { UserEntity } from '@/modules/user/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('accounts')
@Unique(['provider', 'providerAccountId'])
export class AccountEntity {
  @ApiProperty({ example: '92b8a15b-13b2-4a1a-bf41-bba3e7d64d9a' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'google' })
  @Column({ length: 255 })
  provider: string;

  @ApiProperty({ example: '11786321736412' })
  @Column({ name: 'provider_account_id', length: 255 })
  providerAccountId: string;

  @ApiProperty({ example: '2b0a9e10-1d83-4f61-8a3f-bfdc62131d4a' })
  @Column({ name: 'user_id', length: 36 })
  userId?: string;

  // Relation
  @ManyToOne(() => UserEntity, (user) => user.accounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @ApiProperty({ example: '2025-11-12T13:00:00Z' })
  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ example: '2025-11-12T13:00:00Z' })
  @Column({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  constructor(data: Omit<AccountEntity, "id" | "createdAt" | "updatedAt">) {
    Object.assign(this, data);
  }
}
