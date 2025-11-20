import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Field } from '@/shared/model';

import { UserEntity } from './user.entity';

@Entity('accounts')
@Unique(['provider', 'providerAccountId'])
export class AccountEntity {
  @Field({ type: 'string', description: 'The unique identifier of the account', uuid: true })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ type: 'string', description: 'The provider of the account', example: 'google' })
  @Column({ length: 255 })
  provider: string;

  @Field({ type: 'string', description: 'The provider account id of the account', example: '11786321736412' })
  @Column({ name: 'provider_account_id', length: 255 })
  providerAccountId: string;

  @Field({ type: 'string', description: 'The unique identifier of the user', uuid: true })
  @Column({ name: 'user_id' })
  userId?: string;

  // Relations
  @Field({ type: 'class', class: () => UserEntity })
  @ManyToOne(() => UserEntity, (user) => user.accounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Field({ type: 'date', description: 'The date the account was created', example: new Date().toISOString() })
  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Field({ type: 'date', description: 'The date the account was updated', example: new Date().toISOString() })
  @Column({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  constructor(data: Partial<AccountEntity>) {
    Object.assign(this, data);
  }
}
