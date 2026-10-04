import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AppointmentStatus } from '../common/enums';
import { ServiceItem } from '../catalog/catalog.entities';
import { Doctor } from '../doctors/doctor.entity';
import { Pet } from '../pets/pet.entity';

// у врача в одно время может быть только одна активная запись
@Entity('appointments')
@Index('uq_appointments_doctor_slot', ['doctorId', 'startsAt'], { unique: true, where: `"status" <> 'cancelled'` })
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  petId: string;

  @ManyToOne(() => Pet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'petId' })
  pet?: Pet;

  @Column('uuid')
  doctorId: string;

  @ManyToOne(() => Doctor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctorId' })
  doctor?: Doctor;

  @Column({ type: 'uuid', nullable: true })
  serviceId: string | null;

  @ManyToOne(() => ServiceItem, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'serviceId' })
  service?: ServiceItem | null;

  @Index()
  @Column({ type: 'timestamptz' })
  startsAt: Date;

  @Column({ type: 'timestamptz' })
  endsAt: Date;

  @Column({ type: 'varchar', default: AppointmentStatus.Scheduled })
  status: AppointmentStatus;

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  reminder24hSentAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  reminder2hSentAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
