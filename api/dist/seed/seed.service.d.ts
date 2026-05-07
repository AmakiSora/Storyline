import { OnModuleInit } from '@nestjs/common';
import { EventsService } from '../events/events.service.js';
export declare class SeedService implements OnModuleInit {
    private readonly events;
    constructor(events: EventsService);
    onModuleInit(): Promise<void>;
}
