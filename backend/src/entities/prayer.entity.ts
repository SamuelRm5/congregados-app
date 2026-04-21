import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum PrayerType {
  THANKSGIVING = 'THANKSGIVING',
  REQUEST = 'REQUEST',
}

@Entity('prayers')
export class Prayer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: PrayerType })
  type: PrayerType;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'text', nullable: true })
  formattedBody: string | null;

  @Column({ nullable: true, length: 100 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;
}
