import { Entity, Column } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { Role } from '../api/shared/types/role';
import { Base } from './Base';

@ObjectType()
@Entity()
export class User extends Base {
  @Field()
  @Column('text', { unique: true })
  email: string;

  @Column()
  password: string;

  @Field()
  @Column()
  firstname: string;

  @Field()
  @Column()
  lastname: string;

  @Field(() => [Role])
  @Column({ type: 'enum', enum: Role, array: true, default: [] })
  roles: [Role];

  @Field()
  @Column({ default: false })
  confirmed: Boolean;
}
