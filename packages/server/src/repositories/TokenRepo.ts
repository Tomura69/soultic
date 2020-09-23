import { EntityRepository, Repository } from 'typeorm';
import { Token } from '../entities/Token';
import { Service } from 'typedi';

@Service()
@EntityRepository(Token)
export class TokenRepo extends Repository<Token> {}
