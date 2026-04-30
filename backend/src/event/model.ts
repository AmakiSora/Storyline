import { Field, ID, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class Event {
  @Field(() => ID) id!: string;
  @Field() title!: string;
  @Field() date!: string;
  @Field() content!: string;
  @Field({ nullable: true }) image?: string;
  @Field() person!: string;
  @Field() type!: string;
}
