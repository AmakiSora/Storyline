import { Field, InputType } from '@nestjs/graphql';
import { IsDateString, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

@InputType()
export class EventInput {
  @Field(() => String)
  @IsString()
  @MaxLength(200)
  title!: string;

  @Field(() => String)
  @IsDateString()
  date!: string;

  @Field(() => String)
  @IsString()
  content!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl({ require_protocol: true }, { message: 'image 必须是带协议的 URL，例如 https://...' })
  @MaxLength(1024)
  image?: string | null;

  @Field(() => String)
  @IsString()
  @MaxLength(120)
  person!: string;

  @Field(() => String)
  @IsString()
  @MaxLength(120)
  type!: string;
}

