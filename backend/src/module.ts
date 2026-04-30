import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { EventResolver } from './event/resolver';
import { EventService } from './event/service';

@Module({
  imports: [GraphQLModule.forRoot<ApolloDriverConfig>({ driver: ApolloDriver, autoSchemaFile: true })],
  providers: [EventResolver, EventService]
})
export class AppModule {}
