import { Resolver, Mutation, Arg } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { getConnection } from 'typeorm';

import { RegisterInput } from './inputs/register.input';
import { UserRepo } from '../../../repositories/UserRepo';
import { TokenRepo } from '../../../repositories/TokenRepo';
import { sendEmail } from '../../../lib/email/sendEmail';
import { registrationTemplate } from '../../../lib/email/templates/Registration';

@Resolver()
export class RegisterResolver {
  @Mutation(() => Boolean)
  async register(
    @Arg('input')
    input: RegisterInput
  ): Promise<Boolean> {
    input.password = await bcrypt.hash(input.password, 12);

    await getConnection().transaction(async (entityManager) => {
      const { id: userId } = await entityManager
        .getCustomRepository(UserRepo)
        .save(input);

      const { id: tokenId } = await entityManager
        .getCustomRepository(TokenRepo)
        .save({ userId, type: 'register' });

      const mailOptions = registrationTemplate(tokenId, input.email);
      sendEmail(mailOptions);
    });

    return true;
  }
}
