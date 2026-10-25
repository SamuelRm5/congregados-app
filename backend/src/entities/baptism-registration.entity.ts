import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { BaptismParticipant } from './baptism-participant.entity';

// Un envío del formulario; agrupa a todas las personas inscritas a la vez
@Entity('baptism_registrations')
export class BaptismRegistration {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => BaptismParticipant, (p) => p.registration, {
    cascade: true,
  })
  participants: BaptismParticipant[];

  @CreateDateColumn()
  createdAt: Date;
}
