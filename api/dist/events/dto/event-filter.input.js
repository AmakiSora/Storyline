var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';
let EventFilterInput = class EventFilterInput {
    persons;
    types;
    dateFrom;
    dateTo;
    search;
};
__decorate([
    Field(() => [String], { nullable: true }),
    IsOptional(),
    IsArray(),
    IsString({ each: true }),
    __metadata("design:type", Array)
], EventFilterInput.prototype, "persons", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    IsOptional(),
    IsArray(),
    IsString({ each: true }),
    __metadata("design:type", Array)
], EventFilterInput.prototype, "types", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], EventFilterInput.prototype, "dateFrom", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], EventFilterInput.prototype, "dateTo", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], EventFilterInput.prototype, "search", void 0);
EventFilterInput = __decorate([
    InputType()
], EventFilterInput);
export { EventFilterInput };
//# sourceMappingURL=event-filter.input.js.map