import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Event } from './model';
import { EventService } from './service';
import { EventInput } from '../dto/input';

@Resolver(() => Event)
export class EventResolver {
  constructor(private readonly service: EventService) {}
  @Query(() => [Event]) events(@Args('person', { nullable: true }) person?: string, @Args('type', { nullable: true }) type?: string) { return this.service.list(person, type); }
  @Mutation(() => Event) upsertEvent(@Args('input') input: EventInput) { return this.service.upsert(input); }
  @Mutation(() => Boolean) deleteEvent(@Args('id') id: string) { return this.service.remove(id); }
}
