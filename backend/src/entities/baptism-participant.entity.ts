import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaptismRegistration } from './baptism-registration.entity';

@Entity('baptism_participants')
export class BaptismParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => BaptismRegistration, (r) => r.participants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'registration_id' })
  registration: BaptismRegistration;
}
