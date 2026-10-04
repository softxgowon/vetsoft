import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  position: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  // ключ фото на фронтенде
  @Column({ type: 'varchar', default: 'Special' })
  photoKey: string;

  // рабочее время в часовом поясе клиники, формат hh:mm
  @Column({ default: '09:00' })
  workStart: string;

  @Column({ default: '20:00' })
  workEnd: string;

  @Column({ type: 'int', default: 30 })
  slotMinutes: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;
}
