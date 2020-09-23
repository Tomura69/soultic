import { Resolver, Query, Ctx, Mutation, Arg } from 'type-graphql';
import * as dotenv from 'dotenv';
import { User } from '../../../entities/User';
import { MyContext } from '../../../types/MyContext';
import { MeInput } from './inputs/me.input';
import * as bcrypt from 'bcryptjs';
import { UserRepo } from '../../../repositories/UserRepo';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { IsAuth } from '../../middleware/decorators/IsAuth';
import { __ } from 'i18n';
import { AppError } from '../../../utils/AppError';

dotenv.config();

@Resolver()
export class MeResolver {
  @InjectRepository()
  private readonly userRepo: UserRepo;

  @IsAuth()
  @Query(() => User)
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    return ctx.user;
  }

  @IsAuth()
  @Mutation(() => User, { nullable: true })
  async updateMe(
    @Arg('input')
    input: MeInput,
    @Ctx() ctx: MyContext
  ): Promise<User | undefined> {
    const user = ctx.user!;

    // TODO:  Throw validation error instead of regular
    const validPassword = await bcrypt.compare(
      input.currentPassword,
      user.password
    );

    if (!validPassword) throw new AppError(__('validation.invalid-password'));

    if (input.password) input.password = await bcrypt.hash(input.password, 12);

    return this.userRepo.save({ ...user, ...input });
  }
}
