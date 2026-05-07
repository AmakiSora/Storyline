import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm'
import { Event } from './event.entity'

@Entity('persons')
export class Person {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 100, unique: true })
  name: string

  @Column({ type: 'varchar', length: 20, default: '#0ea5e9' })
  color: string

  @Column({ type: 'varchar', length: 200, nullable: true })
  icon: string

  @OneToMany(() => Event, (event) => event.person)
  events: Event[]
}
