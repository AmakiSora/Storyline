import { InputType, Field, Enum, ID } from '@nestjs/graphql'
import { IsString, IsOptional, IsEnum, IsUrl } from 'class-validator'
import { EventType } from '../entities/event.entity'

@InputType()
export class UpdateEventInput {
  @Field(() => ID)
  id: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  date?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  content?: string

  @Field({ nullable: true })
  @IsString()
  @IsUrl()
  @IsOptional()
  image?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  personId?: string

  @Field(() => EventType, { nullable: true })
  @IsEnum(EventType)
  @IsOptional()
  type?: EventType
}
