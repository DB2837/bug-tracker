import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import userService from '../services/userService';

dotenv.config();

export const handleRefreshToken = async (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      return res.status(401).send('invalid cookies');
    }

    const refreshToken = cookies.jwt.replace(/\"/g, ''); //cookie come back whit "" quotes...

    const user = await userService.getUserByTokenJWT(refreshToken);

    if (!user) {
      return res.status(403).send('no User associated whit the token sent'); //forbidden
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      (error: any, decoded: any) => {
        if (
          error ||
          decoded.id !== user.id ||
          decoded.email !== user.email ||
          decoded.firstName !== user.firstName
        ) {
          return res.sendStatus(403);
        }

        const accessToken = jwt.sign(
          {
            id: decoded.id,
            email: decoded.email,
            firstName: decoded.firstName,
          },
          process.env.ACCESS_TOKEN_SECRET as string,
          { expiresIn: '7m' }
        );
        return res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
