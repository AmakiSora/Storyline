import { Repository } from 'typeorm';
import { EventFilterInput } from './dto/event-filter.input.js';
import { EventInput } from './dto/event-input.js';
import { EventEntity } from './event.entity.js';
export declare class EventsService {
    private readonly repo;
    constructor(repo: Repository<EventEntity>);
    findAll(filter?: EventFilterInput): Promise<EventEntity[]>;
    create(input: EventInput): Promise<EventEntity>;
    update(id: string, input: EventInput): Promise<EventEntity>;
    remove(id: string): Promise<boolean>;
    count(): Promise<number>;
    bulkInsert(events: Array<Omit<EventEntity, 'setId'>>): Promise<void>;
}
