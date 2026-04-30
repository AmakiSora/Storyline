import { Field, InputType } from '@nestjs/graphql'
@InputType() export class EventInput { @Field() title!: string; @Field() date!: string; @Field() content!: string; @Field({nullable:true}) image?: string; @Field() person!: string; @Field() type!: string }
@InputType() export class EventFilterInput { @Field({nullable:true}) person?: string; @Field({nullable:true}) type?: string; @Field({nullable:true}) from?: string; @Field({nullable:true}) to?: string }
