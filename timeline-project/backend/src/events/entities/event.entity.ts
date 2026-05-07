import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Person } from './person.entity'

export enum EventType {
  ALBUM = 'album',
  CONCERT = 'concert',
  AWARD = 'award',
  MILESTONE = 'milestone',
  CUSTOM = 'custom',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 200 })
  title: string

  @Column({ type: 'date' })
  date: string

  @Column({ type: 'text', nullable: true })
  content: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  image: string

  @Column({
    type: 'enum',
    enum: EventType,
    default: EventType.CUSTOM,
  })
  type: EventType

  @Column()
  personId: string

  @ManyToOne(() => Person, (person) => person.events, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'personId' })
  person: Person

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}
