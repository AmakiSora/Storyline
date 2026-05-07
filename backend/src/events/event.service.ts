import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Repository } from 'typeorm'
import { EventEntity } from './event.entity'
import { EventFilterInput, EventInput } from './event.dto'
@Injectable()
export class EventService {
  constructor(@InjectRepository(EventEntity) private repo: Repository<EventEntity>) {}
  query(filter?: EventFilterInput) { return this.repo.find({ where: { ...(filter?.person ? { person: filter.person } : {}), ...(filter?.type ? { type: filter.type } : {}), ...(filter?.from && filter?.to ? { date: Between(filter.from, filter.to) } : {}) } }) }
  create(input: EventInput) { return this.repo.save(input) }
  update(id: string, input: EventInput) { return this.repo.save({ id, ...input }) }
  remove(id: string) { return this.repo.delete(id).then(() => true) }
}
