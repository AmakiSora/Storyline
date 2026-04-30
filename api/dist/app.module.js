var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { EventsModule } from './events/events.module.js';
import { SeedService } from './seed/seed.service.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
            ConfigModule.forRoot({ isGlobal: true }),
            TypeOrmModule.forRootAsync({
                inject: [ConfigService],
                useFactory: (config) => {
                    const databaseUrl = config.get('DATABASE_URL') ??
                        'postgresql://storyline:storyline@localhost:5432/storyline';
                    const url = new URL(databaseUrl);
                    return {
                        type: 'postgres',
                        host: url.hostname,
                        port: Number(url.port || 5432),
                        username: decodeURIComponent(url.username),
                        password: decodeURIComponent(url.password),
                        database: url.pathname.replace(/^\//, ''),
                        autoLoadEntities: true,
                        synchronize: true,
                    };
                },
            }),
            GraphQLModule.forRoot({
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
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map