import { Resolver, Mutation, Ctx } from 'type-graphql';
import { IsAuth } from '../../middleware/decorators/IsAuth';
import { MyContext } from '../../../types/MyContext';

@Resolver()
export class LogoutResolver {
  @IsAuth()
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: MyContext): Promise<Boolean> {
    ctx.session.userId = null;
    return true;
  }
}
