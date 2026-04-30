import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Event {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  date: string;

  @Field({ nullable: true })
  content?: string;

  @Field({ nullable: true })
  image?: string;

  @Field()
  person: string;

  @Field()
  type: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}
