import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EventFilterInput } from './dto/event-filter.input.js';
import { EventInput } from './dto/event-input.js';
import { EventEntity } from './event.entity.js';
import { EventsService } from './events.service.js';

@Resolver(() => EventEntity)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Query(() => [EventEntity])
  events(
    @Args('filter', { type: () => EventFilterInput, nullable: true })
    filter?: EventFilterInput,
  ) {
    return this.eventsService.findAll(filter);
  }

  @Mutation(() => EventEntity)
  createEvent(@Args('input', { type: () => EventInput }) input: EventInput) {
    return this.eventsService.create(input);
  }

  @Mutation(() => EventEntity)
  updateEvent(
    @Args('id', { type: () => ID }) id: string,
    @Args('input', { type: () => EventInput }) input: EventInput,
  ) {
    return this.eventsService.update(id, input);
  }

  @Mutation(() => Boolean)
  deleteEvent(@Args('id', { type: () => ID }) id: string) {
    return this.eventsService.remove(id);
  }
}

