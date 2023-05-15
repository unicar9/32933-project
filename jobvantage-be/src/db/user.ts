import db from './dbConnection';
import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  username: string;
  password: string;
}

export const createUser = async (
  username: string,
  hashedPassword: string
): Promise<User> => {
  const id = uuidv4();
  const user: User = { id, username, password: hashedPassword };

  const [createdUser] = await db<User>('users').insert(user).returning('*');
  return createdUser;
};

export const getUserByUsername = async (
  username: string
): Promise<User | undefined> => {
  const user = await db<User>('users').where('username', username).first();
  return user;
};
