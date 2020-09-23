import { TokenRepo } from '../../repositories/TokenRepo';
import { UserRepo } from '../../repositories/UserRepo';
import { getCustomRepository, getConnection } from 'typeorm';
import { Request, Response } from 'express';
import { __ } from 'i18n';

export async function confirmEmail(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const tokenRepo = getCustomRepository(TokenRepo);
    const userRepo = getCustomRepository(UserRepo);

    const url = process.env.FRONTEND_URL!;

    const token = await tokenRepo.findOne({ id, type: 'register' });
    if (!token) return res.send(url + process.env.REGISTER_CONFIRM_ERROR_URL!);

    await getConnection().transaction(async () => {
      await userRepo.update({ id: token.userId }, { confirmed: true });
      await tokenRepo.delete({ id: token.id });
    });

    return res.send(url + process.env.REGISTER_CONFIRM_SUCCESS_URL!);
  } catch (err) {
    console.log(err);
    return res.send(__('error.something-went-wrong'));
  }
}
