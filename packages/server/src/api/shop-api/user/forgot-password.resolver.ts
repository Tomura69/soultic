import * as bcrypt from 'bcryptjs';
import { __ } from 'i18n';
import { Mutation, Resolver, Arg, Ctx } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { UserRepo } from '../../../repositories/UserRepo';
import { TokenRepo } from '../../../repositories/TokenRepo';
import { sendEmail } from '../../../lib/email/sendEmail';
import { PasswordInput } from '../../shared/graphql/inputs/password.input';
import { SessionRepo } from '../../../repositories/SessionRepo';
import { MyContext } from '../../../types/MyContext';
import { User } from '../../../entities/User';
import { Token } from '../../../entities/Token';
import { forgotPasswordTemplate } from '../../../lib/email/templates/ForgotPassword';
import { getManager } from 'typeorm';
import { AppError } from '../../../utils/AppError';

@Resolver()
export class ForgotPasswordResolver {
  @InjectRepository()
  private userRepo: UserRepo;
  @InjectRepository()
  private tokenRepo: TokenRepo;
  @InjectRepository()
  private sessionRepo: SessionRepo;

  @Mutation(() => Boolean)
  async forgotPassword(@Arg('email') email: string): Promise<Boolean> {
    const user = await this.userRepo.findOne({ email });
    if (!user) throw new AppError(__('error.user-doesnt-exist'));

    await this.tokenRepo.delete({ userId: user.id });

    const token = await this.tokenRepo.save({
      userId: user.id,
      type: 'forgot-password',
    });

    const mailOptions = forgotPasswordTemplate(token.id, user.email);
    sendEmail(mailOptions);

    return true;
  }

  @Mutation(() => User)
  async forgotPasswordConfirm(
    @Arg('token') tokenId: string,
    @Arg('input') { password }: PasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<any> {
    const token = await this.tokenRepo.findOne({
      id: tokenId,
      type: 'forgot-password',
    });
    if (!token) throw new AppError(__('error.invalid-token'));

    password = await bcrypt.hash(password!, 12);

    await getManager().transaction(async (entityManager) => {
      await entityManager.update(User, { id: token.userId }, { password });
      await entityManager.delete(Token, { id: tokenId });
    });
    await this.sessionRepo.delete({ userId: token.userId });

    ctx.session.userId = token.userId;
    return this.userRepo.findOne({ id: token.userId });
  }
}
