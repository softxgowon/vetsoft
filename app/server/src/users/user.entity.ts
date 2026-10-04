import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../common/enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @Column()
  fullName: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', default: Role.Owner })
  role: Role;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}

export type PublicUser = Omit<User, 'passwordHash'>;

export const toPublicUser = (user: User): PublicUser => {
  const { passwordHash: _hash, ...rest } = user;
  return rest;
};
