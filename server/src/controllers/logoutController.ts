import { Request, Response } from 'express';
import userService from '../services/userService';

export const handleLogout = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); //No content
  }

  const refreshToken = cookies.jwt.replace(/\"/g, '');
  const user = await userService.getUserByTokenJWT(refreshToken);

  if (!user) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
    return res.sendStatus(204);
  }

  await userService.deleteTokenJWT(user.id);

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
  return res.sendStatus(204);
};
