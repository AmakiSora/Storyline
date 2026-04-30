import { Field, ObjectType } from '@nestjs/graphql';
import { randomUUID } from 'node:crypto';
import { BeforeInsert, Column, Entity, Index, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'event' })
export class EventEntity {
  @Field(() => String)
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 200 })
  @Index()
  title!: string;

  @Field(() => String)
  @Column({ type: 'date' })
  @Index()
  date!: string;

  @Field(() => String)
  @Column({ type: 'text' })
  content!: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 1024, nullable: true })
  image?: string | null;

  @Field(() => String)
  @Column({ type: 'varchar', length: 120 })
  @Index()
  person!: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 120 })
  @Index()
  type!: string;

  @BeforeInsert()
  setId() {
    if (!this.id) this.id = randomUUID();
  }
}

