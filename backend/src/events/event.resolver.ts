import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { EventEntity } from './event.entity'
import { EventFilterInput, EventInput } from './event.dto'
import { EventService } from './event.service'
@Resolver(() => EventEntity)
export class EventResolver {
  constructor(private service: EventService) {}
  @Query(() => [EventEntity]) events(@Args('filter', { nullable: true }) filter?: EventFilterInput) { return this.service.query(filter) }
  @Mutation(() => EventEntity) createEvent(@Args('input') input: EventInput) { return this.service.create(input) }
  @Mutation(() => EventEntity) updateEvent(@Args('id') id: string, @Args('input') input: EventInput) { return this.service.update(id, input) }
  @Mutation(() => Boolean) deleteEvent(@Args('id') id: string) { return this.service.remove(id) }
}
