import { Resolver, Query, Ctx } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User } from '../../../entities/User';
import { MyContext } from '../../../types/MyContext';
import { UserRepo } from '../../../repositories/UserRepo';

@Resolver()
export class AdminMeResolver {
  @InjectRepository()
  private readonly userRepo: UserRepo;

  @Query(() => User)
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    return ctx.user;
  }
}
