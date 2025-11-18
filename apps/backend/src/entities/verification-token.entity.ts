import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from './user.entity';

export enum VerificationType {
  ACTIVE_ACCOUNT = 'ACTIVE_ACCOUNT',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

@Entity('verification_tokens')
export class VerificationTokenEntity {
  @ApiProperty({ example: '2b0a9e10-1d83-4f61-8a3f-bfdc62131d4a' })
  @PrimaryGeneratedColumn('uuid')
  token: string;

  @ApiProperty({ enum: VerificationType })
  @Column({ enum: VerificationType, type: 'enum' })
  type: VerificationType;

  @ApiProperty({ example: '2025-11-12T13:00:00Z' })
  @Column({ type: 'timestamptz' })
  expires: Date;

  @ApiProperty()
  @Column({ name: 'user_id' })
  userId: string;

  @ApiProperty({ example: '2025-11-12T13:00:00Z' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ example: '2025-11-12T13:00:00Z' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ApiProperty({ type: () => UserEntity, required: false })
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  constructor(data: Partial<VerificationTokenEntity>) {
    Object.assign(this, data);
  }
}