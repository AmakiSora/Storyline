import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
} from '@nestjs/graphql'
import { UseFilters } from '@nestjs/common'
import { EventService } from './events.service'
import { Event } from './entities/event.entity'
import { Person } from './entities/person.entity'
import { CreateEventInput } from './dto/create-event.input'
import { UpdateEventInput } from './dto/update-event.input'

@Resolver(() => Event)
export class EventsResolver {
  constructor(private readonly eventService: EventService) {}

  // ==================== Event Queries ====================

  @Query(() => [Event], { name: 'events' })
  async findAllEvents(): Promise<Event[]> {
    return this.eventService.findAll()
  }

  @Query(() => Event, { name: 'event' })
  async findOneEvent(@Args('id', { type: () => ID }) id: string): Promise<Event> {
    return this.eventService.findOne(id)
  }

  // ==================== Event Mutations ====================

  @Mutation(() => Event, { name: 'createEvent' })
  async createEvent(
    @Args('input') input: CreateEventInput,
  ): Promise<Event> {
    return this.eventService.create(input)
  }

  @Mutation(() => Event, { name: 'updateEvent' })
  async updateEvent(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateEventInput,
  ): Promise<Event> {
    return this.eventService.update(id, input)
  }

  @Mutation(() => Boolean, { name: 'deleteEvent' })
  async deleteEvent(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.eventService.remove(id)
    return true
  }

  // ==================== Person Queries ====================

  @Query(() => [Person], { name: 'persons' })
  async findAllPersons(): Promise<Person[]> {
    return this.eventService.findAllPersons()
  }

  @Query(() => Person, { name: 'person' })
  async findOnePerson(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Person> {
    return this.eventService.findOnePerson(id)
  }

  @Mutation(() => Person, { name: 'createPerson' })
  async createPerson(
    @Args('name') name: string,
    @Args('color', { nullable: true }) color?: string,
  ): Promise<Person> {
    return this.eventService.createPerson(name, color)
  }
}
