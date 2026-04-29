var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, ObjectType } from '@nestjs/graphql';
import { randomUUID } from 'node:crypto';
import { BeforeInsert, Column, Entity, Index, PrimaryColumn } from 'typeorm';
let EventEntity = class EventEntity {
    id;
    title;
    date;
    content;
    image;
    person;
    type;
    setId() {
        if (!this.id)
            this.id = randomUUID();
    }
};
__decorate([
    Field(() => String),
    PrimaryColumn({ type: 'uuid' }),
    __metadata("design:type", String)
], EventEntity.prototype, "id", void 0);
__decorate([
    Field(() => String),
    Column({ type: 'varchar', length: 200 }),
    Index(),
    __metadata("design:type", String)
], EventEntity.prototype, "title", void 0);
__decorate([
    Field(() => String),
    Column({ type: 'date' }),
    Index(),
    __metadata("design:type", String)
], EventEntity.prototype, "date", void 0);
__decorate([
    Field(() => String),
    Column({ type: 'text' }),
    __metadata("design:type", String)
], EventEntity.prototype, "content", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Column({ type: 'varchar', length: 1024, nullable: true }),
    __metadata("design:type", Object)
], EventEntity.prototype, "image", void 0);
__decorate([
    Field(() => String),
    Column({ type: 'varchar', length: 120 }),
    Index(),
    __metadata("design:type", String)
], EventEntity.prototype, "person", void 0);
__decorate([
    Field(() => String),
    Column({ type: 'varchar', length: 120 }),
    Index(),
    __metadata("design:type", String)
], EventEntity.prototype, "type", void 0);
__decorate([
    BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EventEntity.prototype, "setId", null);
EventEntity = __decorate([
    ObjectType(),
    Entity({ name: 'event' })
], EventEntity);
export { EventEntity };
//# sourceMappingURL=event.entity.js.map