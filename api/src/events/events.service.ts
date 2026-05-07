import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventFilterInput } from './dto/event-filter.input.js';
import { EventInput } from './dto/event-input.js';
import { EventEntity } from './event.entity.js';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly repo: Repository<EventEntity>,
  ) {}

  async findAll(filter?: EventFilterInput): Promise<EventEntity[]> {
    const qb = this.repo.createQueryBuilder('e').orderBy('e.date', 'ASC');

    if (filter?.persons?.length) qb.andWhere('e.person IN (:...persons)', { persons: filter.persons });
    if (filter?.types?.length) qb.andWhere('e.type IN (:...types)', { types: filter.types });
    if (filter?.dateFrom) qb.andWhere('e.date >= :dateFrom', { dateFrom: filter.dateFrom });
    if (filter?.dateTo) qb.andWhere('e.date <= :dateTo', { dateTo: filter.dateTo });
    if (filter?.search) {
      qb.andWhere('(e.title LIKE :q OR e.content LIKE :q)', { q: `%${filter.search}%` });
    }

    return qb.getMany();
  }

  async create(input: EventInput): Promise<EventEntity> {
    const entity = this.repo.create({
      title: input.title,
      date: input.date,
      content: input.content,
      image: input.image ?? null,
      person: input.person,
      type: input.type,
    });

    return this.repo.save(entity);
  }

  async update(id: string, input: EventInput): Promise<EventEntity> {
    await this.repo.update({ id }, { ...input, image: input.image ?? null });
    return this.repo.findOneByOrFail({ id });
  }

  async remove(id: string): Promise<boolean> {
    const res = await this.repo.delete({ id });
    return (res.affected ?? 0) > 0;
  }

  async count(): Promise<number> {
    return this.repo.count();
  }

  async bulkInsert(events: Array<Omit<EventEntity, 'setId'>>): Promise<void> {
    await this.repo.save(events.map((e) => this.repo.create(e)));
  }
}

