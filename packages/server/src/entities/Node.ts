import { PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, InterfaceType } from 'type-graphql';

@InterfaceType()
export abstract class Node {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;
}
