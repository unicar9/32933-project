import db from './dbConnection';
import { v4 as uuidv4 } from 'uuid';

interface UserProfile {
  id: string;
  user_id: string;
  title: string;
  location: string;
  description: string;
}

export const createUserProfile = async (
  userId: string,
  title: string,
  location: string,
  description: string
): Promise<UserProfile> => {
  const id = uuidv4();
  const userProfile: UserProfile = {
    id,
    user_id: userId,
    title,
    location,
    description,
  };

  const [createdUser] = await db<UserProfile>('user_profiles')
    .insert(userProfile)
    .returning('*');
  return createdUser;
};

export const getAllUserProfilesByUserId = async (
  userId: string
): Promise<UserProfile[]> => {
  const userProfiles = await db<UserProfile>('user_profiles')
    .where('user_id', userId)
    .select();
  return userProfiles;
};

export const getUserProfileById = async (
  id: string
): Promise<UserProfile | null> => {
  const userProfile = await db<UserProfile>('user_profiles')
    .where('id', id)
    .first();
  return userProfile || null;
};

export const getUserProfileByUsername = async (
  username: string
): Promise<UserProfile | null> => {
  const userProfile = await db<UserProfile>('user_profiles')
    .join('users', 'user_profiles.user_id', '=', 'users.id')
    .where('users.username', username)
    .select('user_profiles.*')
    .first();
  return userProfile || null;
};

export const updateUserProfile = async (
  id: string,
  updatedUserProfile: Partial<UserProfile>
): Promise<UserProfile | null> => {
  const [updatedUser] = await db<UserProfile>('user_profiles')
    .where('id', id)
    .update(updatedUserProfile)
    .returning('*');
  return updatedUser || null;
};

export const deleteUserProfile = async (id: string): Promise<boolean> => {
  const deletedCount = await db<UserProfile>('user_profiles')
    .where('id', id)
    .del();
  return deletedCount > 0;
};
