import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
@ObjectType()
@Entity()
export class EventEntity {
  @Field(() => ID) @PrimaryGeneratedColumn('uuid') id!: string
  @Field() @Column() title!: string
  @Field() @Column('date') date!: string
  @Field() @Column('text') content!: string
  @Field({ nullable: true }) @Column({ nullable: true }) image?: string
  @Field() @Column() person!: string
  @Field() @Column() type!: string
}
