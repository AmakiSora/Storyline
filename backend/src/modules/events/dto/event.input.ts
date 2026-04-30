import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateEventInput {
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
}

@InputType()
export class UpdateEventInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  date?: string;

  @Field({ nullable: true })
  content?: string;

  @Field({ nullable: true })
  image?: string;

  @Field({ nullable: true })
  person?: string;

  @Field({ nullable: true })
  type?: string;
}
