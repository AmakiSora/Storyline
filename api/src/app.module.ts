import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { EventsModule } from './events/events.module.js';
import { SeedService } from './seed/seed.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbType = (config.get<string>('DB_TYPE') ?? 'sqlite').toLowerCase();
        if (dbType === 'postgres') {
          const databaseUrl =
            config.get<string>('DATABASE_URL') ??
            'postgresql://storyline:storyline@localhost:5432/storyline';
          const url = new URL(databaseUrl);
          return {
            type: 'postgres' as const,
            host: url.hostname,
            port: Number(url.port || 5432),
            username: decodeURIComponent(url.username),
            password: decodeURIComponent(url.password),
            database: url.pathname.replace(/^\//, ''),
            autoLoadEntities: true,
            synchronize: true,
          };
        }

        const sqlitePath = config.get<string>('SQLITE_PATH') ?? './data/storyline.sqlite';
        const abs = path.isAbsolute(sqlitePath) ? sqlitePath : path.resolve(process.cwd(), sqlitePath);
        mkdirSync(path.dirname(abs), { recursive: true });
        return {
          type: 'sqlite' as const,
          database: abs,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: true,
      introspection: true,
    }),
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {}
