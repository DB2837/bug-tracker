import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import userService from '../services/userService';

dotenv.config();

export const handleLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: 'Username and password are required.' });
    }

    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res.status(401).send('User not found'); //Unauthorized
    }

    const userPassword = await userService.getUserPassword(user.id);
    const passwordMatch = await bcrypt.compare(password, userPassword!);

    if (!passwordMatch) {
      return res.sendStatus(401);
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, firstName: user.firstName },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '7m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email, firstName: user.firstName },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: '7d' }
    );

    await userService.setRefreshToken(user, refreshToken);

    res.cookie('jwt', JSON.stringify(refreshToken), {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 24 * 60 * 60 * 7000,
    });

    return res.status(201).json({ accessToken });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
