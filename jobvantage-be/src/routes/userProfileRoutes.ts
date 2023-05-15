import { Request, Response } from 'express';
import {
  createUserProfile,
  getUserProfileById,
  getUserProfileByUsername,
  updateUserProfile,
  deleteUserProfile,
  getAllUserProfilesByUserId,
} from '../db/userProfile';
import { convertKeysToCamelCase } from '../utils/camelCaseConverter';

type ConvertedUserProfile = {
  title: string;
  location: string;
  description: string;
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export const createUserProfileRoute = async (req: Request, res: Response) => {
  const { userId, title, location, description } = req.body;

  if (!userId || !title || !location || !description) {
    return res.status(400).json({
      error: 'User ID, title, location, and description are required',
    });
  }

  const userProfile = await createUserProfile(
    userId,
    title,
    location,
    description
  );
  res
    .status(201)
    .json(convertKeysToCamelCase<ConvertedUserProfile>(userProfile));
};

export const getAllUserProfileByUserIdRoute = async (
  req: Request,
  res: Response
) => {
  console.log('req.body.userId: ', req.body.userId);
  const userProfiles = await getAllUserProfilesByUserId(req.body.userId);

  const converted = userProfiles.map((profile) =>
    convertKeysToCamelCase<ConvertedUserProfile>(profile)
  );

  res.status(200).json(converted);
};

export const getUserProfileByIdRoute = async (req: Request, res: Response) => {
  const userProfile = await getUserProfileById(req.params.id);

  if (!userProfile) {
    return res.status(404).json({ error: 'User profile not found' });
  }

  res
    .status(200)
    .json(convertKeysToCamelCase<ConvertedUserProfile>(userProfile));
};

export const getUserProfileByUsernameRoute = async (
  req: Request,
  res: Response
) => {
  const userProfile = await getUserProfileByUsername(req.params.username);

  if (!userProfile) {
    return res.status(404).json({ error: 'User profile not found' });
  }

  res
    .status(200)
    .json(convertKeysToCamelCase<ConvertedUserProfile>(userProfile));
};

export const updateUserProfileRoute = async (req: Request, res: Response) => {
  const { title, location, description } = req.body;
  console.log('req.body: ', req.body);
  const userProfile = await updateUserProfile(req.body.id, {
    title,
    location,
    description,
  });

  if (!userProfile) {
    return res.status(404).json({ error: 'User profile not found' });
  }

  res
    .status(200)
    .json(convertKeysToCamelCase<ConvertedUserProfile>(userProfile));
};

export const deleteUserProfileRoute = async (req: Request, res: Response) => {
  const success = await deleteUserProfile(req.params.id);

  if (!success) {
    return res.status(404).json({ error: 'User profile not found' });
  }

  res.status(200).json({ message: 'User profile deleted successfully' });
};
