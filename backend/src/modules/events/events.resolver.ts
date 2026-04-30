import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { EventsService, EventFilter } from './events.service';
import { Event } from './entities/event.entity';
import { CreateEventInput, UpdateEventInput } from './dto/event.input';

@Resolver(() => Event)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Query(() => [Event], { name: 'events' })
  findAll(
    @Args('person', { nullable: true }) person?: string,
    @Args('type', { nullable: true }) type?: string,
    @Args('startDate', { nullable: true }) startDate?: string,
    @Args('endDate', { nullable: true }) endDate?: string,
  ): Event[] {
    const filter: EventFilter = {};
    if (person) filter.person = person;
    if (type) filter.type = type;
    if (startDate) filter.startDate = startDate;
    if (endDate) filter.endDate = endDate;
    return this.eventsService.findAll(Object.keys(filter).length > 0 ? filter : undefined);
  }

  @Query(() => Event, { name: 'event', nullable: true })
  findOne(@Args('id', { type: () => ID }) id: string): Event | undefined {
    return this.eventsService.findOne(id);
  }

  @Mutation(() => Event)
  createEvent(@Args('input', { type: () => CreateEventInput }) input: CreateEventInput): Event {
    return this.eventsService.create(input);
  }

  @Mutation(() => Event, { nullable: true })
  updateEvent(
    @Args('id', { type: () => ID }) id: string,
    @Args('input', { type: () => UpdateEventInput }) input: UpdateEventInput,
  ): Event | undefined {
    return this.eventsService.update(id, input);
  }

  @Mutation(() => Boolean)
  deleteEvent(@Args('id', { type: () => ID }) id: string): boolean {
    return this.eventsService.delete(id);
  }
}
