import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Field, Int, ObjectType } from 'type-graphql'

const formatDate = (date: Date | null) => {
  if (date === null) return null
  const convertTime = (number: number) => (number < 10 ? `0${number}` : number)

  const year = date.getFullYear()
  const month = convertTime(date.getMonth() + 1)
  const day = convertTime(date.getDate())
  const hours = convertTime(date.getHours())
  const minutes = convertTime(date.getMinutes())

  return `${[year, month, day].join('/')} ${[hours, minutes].join(':')}`
}

@ObjectType()
export abstract class Base {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @CreateDateColumn({
    transformer: {
      to: (value) => value,
      from: formatDate,
    },
  })
  createdAt: String

  @Field()
  @UpdateDateColumn({
    transformer: {
      to: (value) => value,
      from: formatDate,
    },
  })
  updatedAt: String

  @Field({ nullable: true })
  @DeleteDateColumn({
    transformer: {
      to: (value) => value,
      from: formatDate,
    },
  })
  deletedAt: String
}
