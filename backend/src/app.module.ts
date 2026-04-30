import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventModule } from './events/event.module'
@Module({
  imports: [
    GraphQLModule.forRoot({ autoSchemaFile: true }),
    TypeOrmModule.forRoot({ type: 'postgres', host: 'localhost', port: 5432, username: 'postgres', password: 'postgres', database: 'timeline', autoLoadEntities: true, synchronize: true }),
    EventModule
  ]
})
export class AppModule {}
