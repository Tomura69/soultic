import { EntityRepository, Repository } from 'typeorm';
import { Service } from 'typedi';
import { Session } from '../entities/Session';

@Service()
@EntityRepository(Session)
export class SessionRepo extends Repository<Session> {}
