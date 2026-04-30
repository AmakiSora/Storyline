import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventEntity } from './event.entity'
import { EventResolver } from './event.resolver'
import { EventService } from './event.service'
@Module({ imports: [TypeOrmModule.forFeature([EventEntity])], providers: [EventResolver, EventService] })
export class EventModule {}
