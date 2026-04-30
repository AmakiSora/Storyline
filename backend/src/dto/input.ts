import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class EventInput {
  @Field() id!: string;
  @Field() title!: string;
  @Field() date!: string;
  @Field() content!: string;
  @Field({ nullable: true }) image?: string;
  @Field() person!: string;
  @Field() type!: string;
}
