import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Doctor } from '../doctors/doctor.entity';
import { Pet } from '../pets/pet.entity';

export interface LabItem {
  name: string;
  value: string;
  unit?: string;
  reference?: string;
}

// прием у врача: жалобы, диагноз, лечение
@Entity('medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  petId: string;

  @ManyToOne(() => Pet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'petId' })
  pet?: Pet;

  @Column({ type: 'uuid', nullable: true })
  doctorId: string | null;

  @ManyToOne(() => Doctor, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'doctorId' })
  doctor?: Doctor | null;

  @Column({ type: 'timestamptz' })
  visitedAt: Date;

  @Column({ type: 'text', nullable: true })
  complaint: string | null;

  @Column()
  diagnosis: string;

  @Column({ type: 'text', nullable: true })
  treatment: string | null;

  @Column({ type: 'text', nullable: true })
  recommendations: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}

@Entity('lab_results')
export class LabResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  petId: string;

  @ManyToOne(() => Pet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'petId' })
  pet?: Pet;

  @Column()
  title: string;

  @Column({ type: 'date' })
  takenAt: string;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  items: LabItem[];

  @Column({ type: 'text', nullable: true })
  conclusion: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  petId: string;

  @ManyToOne(() => Pet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'petId' })
  pet?: Pet;

  @Column({ type: 'uuid', nullable: true })
  doctorId: string | null;

  @ManyToOne(() => Doctor, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'doctorId' })
  doctor?: Doctor | null;

  @Column({ type: 'date' })
  prescribedAt: string;

  @Column()
  medication: string;

  @Column()
  dosage: string;

  @Column({ type: 'varchar', nullable: true })
  duration: string | null;

  @Column({ type: 'text', nullable: true })
  instructions: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}

@Entity('vaccinations')
export class Vaccination {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  petId: string;

  @ManyToOne(() => Pet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'petId' })
  pet?: Pet;

  @Column()
  vaccine: string;

  @Column({ type: 'date' })
  vaccinatedAt: string;

  // дата следующей ревакцинации, по ней приходит напоминание
  @Column({ type: 'date', nullable: true })
  nextDueAt: string | null;

  @Column({ type: 'varchar', nullable: true })
  batchNumber: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  reminderSentAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
