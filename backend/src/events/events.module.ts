import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Event } from './entities/event.entity'
import { Person } from './entities/person.entity'
import { EventsResolver } from './events.resolver'
import { EventService } from './events.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Person]),
  ],
  providers: [EventsResolver, EventService],
  exports: [EventService],
})
export class EventsModule {}
