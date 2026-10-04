import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Gender, Species } from '../common/enums';
import { numericTransformer } from '../common/numeric.transformer';
import { User } from '../users/user.entity';

@Entity('pets')
export class Pet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  ownerId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner?: User;

  @Column()
  name: string;

  @Column({ type: 'varchar' })
  species: Species;

  @Column({ type: 'varchar', nullable: true })
  breed: string | null;

  @Column({ type: 'varchar', default: Gender.Unknown })
  gender: Gender;

  @Column({ type: 'date', nullable: true })
  birthDate: string | null;

  @Column({ type: 'numeric', precision: 6, scale: 2, nullable: true, transformer: numericTransformer })
  weightKg: number | null;

  @Column({ type: 'varchar', nullable: true })
  chipNumber: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
