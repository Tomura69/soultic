import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  Entity,
  Column,
} from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'
import { User } from '../user/user.entity'

@ObjectType()
@Entity()
export class Token {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToOne(() => User)
  @JoinColumn()
  user: User

  @Column()
  userId: number

  @Column()
  type: string

  @CreateDateColumn()
  createdAt: Date
}
