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
import { IsDateString, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
let EventInput = class EventInput {
    title;
    date;
    content;
    image;
    person;
    type;
};
__decorate([
    Field(() => String),
    IsString(),
    MaxLength(200),
    __metadata("design:type", String)
], EventInput.prototype, "title", void 0);
__decorate([
    Field(() => String),
    IsDateString(),
    __metadata("design:type", String)
], EventInput.prototype, "date", void 0);
__decorate([
    Field(() => String),
    IsString(),
    __metadata("design:type", String)
], EventInput.prototype, "content", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    IsOptional(),
    IsUrl({ require_protocol: true }, { message: 'image 必须是带协议的 URL，例如 https://...' }),
    MaxLength(1024),
    __metadata("design:type", Object)
], EventInput.prototype, "image", void 0);
__decorate([
    Field(() => String),
    IsString(),
    MaxLength(120),
    __metadata("design:type", String)
], EventInput.prototype, "person", void 0);
__decorate([
    Field(() => String),
    IsString(),
    MaxLength(120),
    __metadata("design:type", String)
], EventInput.prototype, "type", void 0);
EventInput = __decorate([
    InputType()
], EventInput);
export { EventInput };
//# sourceMappingURL=event-input.js.map