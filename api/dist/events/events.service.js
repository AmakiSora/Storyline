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
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from './event.entity.js';
let EventsService = class EventsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findAll(filter) {
        const qb = this.repo.createQueryBuilder('e').orderBy('e.date', 'ASC');
        if (filter?.persons?.length)
            qb.andWhere('e.person IN (:...persons)', { persons: filter.persons });
        if (filter?.types?.length)
            qb.andWhere('e.type IN (:...types)', { types: filter.types });
        if (filter?.dateFrom)
            qb.andWhere('e.date >= :dateFrom', { dateFrom: filter.dateFrom });
        if (filter?.dateTo)
            qb.andWhere('e.date <= :dateTo', { dateTo: filter.dateTo });
        if (filter?.search) {
            qb.andWhere('(e.title LIKE :q OR e.content LIKE :q)', { q: `%${filter.search}%` });
        }
        return qb.getMany();
    }
    async create(input) {
        const entity = this.repo.create({
            title: input.title,
            date: input.date,
            content: input.content,
            image: input.image ?? null,
            person: input.person,
            type: input.type,
        });
        return this.repo.save(entity);
    }
    async update(id, input) {
        await this.repo.update({ id }, { ...input, image: input.image ?? null });
        return this.repo.findOneByOrFail({ id });
    }
    async remove(id) {
        const res = await this.repo.delete({ id });
        return (res.affected ?? 0) > 0;
    }
    async count() {
        return this.repo.count();
    }
    async bulkInsert(events) {
        await this.repo.save(events.map((e) => this.repo.create(e)));
    }
};
EventsService = __decorate([
    Injectable(),
    __param(0, InjectRepository(EventEntity)),
    __metadata("design:paramtypes", [Repository])
], EventsService);
export { EventsService };
//# sourceMappingURL=events.service.js.map