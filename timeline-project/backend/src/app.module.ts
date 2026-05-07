import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventsModule } from './events/events.module'
import { AppDataSource } from './database/data-source'

@Module({
  imports: [
    // GraphQL 模块
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: {
        sortSchema: true,
        introspection: true,
        output: 'src/schema.gql',
      },
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    }),

    // TypeORM 数据库模块
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'timeline',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // 开发环境自动同步
        logging: true,
      }),
    }),

    // 事件模块
    EventsModule,
  ],
})
export class AppModule {}
