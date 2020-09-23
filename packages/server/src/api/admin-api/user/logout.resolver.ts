import { Resolver, Mutation, Ctx } from 'type-graphql';
import { IsAuth } from '../../middleware/decorators/IsAuth';
import { MyContext } from '../../../types/MyContext';

@Resolver()
export class AdminLogoutResolver {
  @IsAuth()
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: MyContext): Promise<Boolean> {
    ctx.session.destroy((err) => {});
    return true;
  }
}
