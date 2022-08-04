import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import userService from '../services/userService';

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).send(users);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).send('Please add all fields');
    }

    const userExists = await userService.getUserByEmail(email);
    if (userExists) {
      return res.status(409).send('User already Exists'); //conflict
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassowrd = await bcrypt.hash(password, salt);

    const user = await userService.addUser(
      email,
      hashedPassowrd,
      firstName,
      lastName
    );

    return res.status(201).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
