import { EventFilterInput } from './dto/event-filter.input.js';
import { EventInput } from './dto/event-input.js';
import { EventEntity } from './event.entity.js';
import { EventsService } from './events.service.js';
export declare class EventsResolver {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    events(filter?: EventFilterInput): Promise<EventEntity[]>;
    createEvent(input: EventInput): Promise<EventEntity>;
    updateEvent(id: string, input: EventInput): Promise<EventEntity>;
    deleteEvent(id: string): Promise<boolean>;
}
