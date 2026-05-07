import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

@InputType()
export class EventFilterInput {
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  persons?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  types?: string[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  search?: string;
}

