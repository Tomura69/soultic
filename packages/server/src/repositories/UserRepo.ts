import { EntityRepository, Repository } from 'typeorm'
import { User } from '../entities/User'
import { Service } from 'typedi'

@Service()
@EntityRepository(User)
export class UserRepo extends Repository<User> {}
