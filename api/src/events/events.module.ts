import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './event.entity.js';
import { EventsResolver } from './events.resolver.js';
import { EventsService } from './events.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity])],
  providers: [EventsResolver, EventsService],
  exports: [EventsService],
})
export class EventsModule {}

