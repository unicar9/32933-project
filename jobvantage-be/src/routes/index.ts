import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { createUser, getUserByUsername } from '../db/user';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: 'Username and password are required' });
  }

  const existingUser = await getUserByUsername(username);

  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = await createUser(username, hashedPassword);
  const token = jwt.sign({ userId: newUser.id }, SECRET_KEY, {
    expiresIn: '1h',
  });

  res.status(201).json({ token, user: newUser });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: 'Username and password are required' });
  }

  const user = await getUserByUsername(username);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });

  res.status(200).json({ token, user });
};
