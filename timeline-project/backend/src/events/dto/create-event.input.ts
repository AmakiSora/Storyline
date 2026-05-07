import { InputType, Field, Enum } from '@nestjs/graphql'
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUrl } from 'class-validator'
import { EventType } from '../entities/event.entity'

@InputType()
export class CreateEventInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string

  @Field()
  @IsString()
  @IsNotEmpty()
  date: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  content?: string

  @Field({ nullable: true })
  @IsString()
  @IsUrl()
  @IsOptional()
  image?: string

  @Field()
  @IsString()
  @IsNotEmpty()
  personId: string

  @Field(() => EventType)
  @IsEnum(EventType)
  type: EventType
}
