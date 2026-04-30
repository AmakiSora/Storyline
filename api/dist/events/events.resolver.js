var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EventFilterInput } from './dto/event-filter.input.js';
import { EventInput } from './dto/event-input.js';
import { EventEntity } from './event.entity.js';
import { EventsService } from './events.service.js';
let EventsResolver = class EventsResolver {
    eventsService;
    constructor(eventsService) {
        this.eventsService = eventsService;
    }
    events(filter) {
        return this.eventsService.findAll(filter);
    }
    createEvent(input) {
        return this.eventsService.create(input);
    }
    updateEvent(id, input) {
        return this.eventsService.update(id, input);
    }
    deleteEvent(id) {
        return this.eventsService.remove(id);
    }
};
__decorate([
    Query(() => [EventEntity]),
    __param(0, Args('filter', { type: () => EventFilterInput, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EventFilterInput]),
    __metadata("design:returntype", void 0)
], EventsResolver.prototype, "events", null);
__decorate([
    Mutation(() => EventEntity),
    __param(0, Args('input', { type: () => EventInput })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EventInput]),
    __metadata("design:returntype", void 0)
], EventsResolver.prototype, "createEvent", null);
__decorate([
    Mutation(() => EventEntity),
    __param(0, Args('id', { type: () => ID })),
    __param(1, Args('input', { type: () => EventInput })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, EventInput]),
    __metadata("design:returntype", void 0)
], EventsResolver.prototype, "updateEvent", null);
__decorate([
    Mutation(() => Boolean),
    __param(0, Args('id', { type: () => ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventsResolver.prototype, "deleteEvent", null);
EventsResolver = __decorate([
    Resolver(() => EventEntity),
    __metadata("design:paramtypes", [EventsService])
], EventsResolver);
export { EventsResolver };
//# sourceMappingURL=events.resolver.js.map