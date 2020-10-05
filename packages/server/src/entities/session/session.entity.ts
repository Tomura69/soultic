import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm'
import { SessionEntity } from '../../lib/session/TypeormStore'
import 'dotenv'
import { User } from '../user/user.entity'

@Entity()
export class Session implements SessionEntity {
  @PrimaryColumn('varchar', { length: 255 })
  id: string

  @CreateDateColumn()
  expiresAt: Date

  @Column('text')
  data: string

  @Column({ nullable: true })
  userId: number

  @ManyToOne(() => User)
  @JoinColumn()
  user: User

  // TODO:   Create relation with order entity
  @Column({ nullable: true })
  activeOrderId: number
}
