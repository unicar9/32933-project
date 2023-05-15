import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { getUserProfileById } from '../db/userProfile';
import { recommendJobs, Job } from '../utils/contentFiltering';
import { isEmpty } from 'lodash';

const jobsData = fs.readFileSync(
  path.resolve(__dirname, '..', 'data', 'jobsData.json'),
  'utf8'
);
const jobs = JSON.parse(jobsData);

const jobRecommendationsCache = {} as any;

export const createJobRecommendationsRoute = async (
  req: Request,
  res: Response
) => {
  const { userId, userProfileId } = req.body;

  if (!userId || !userProfileId) {
    return res.status(400).json({
      error: 'User ID and user profile ID are required',
    });
  }

  const userProfile = await getUserProfileById(userProfileId);

  if (!userProfile) {
    return res.status(404).json({ error: 'User profile not found' });
  }

  // Check if the recommended jobs are already cached for the given userProfileId
  let recommendedJobs = jobRecommendationsCache[userProfileId];

  // If the recommended jobs are not cached, calculate and store them in the cache
  if (!recommendedJobs) {
    let feedbackData;
    try {
      feedbackData = fs.readFileSync(
        path.resolve(__dirname, '..', 'data', 'feedback.json'),
        'utf8'
      );
    } catch (err) {
      feedbackData = '{}';
    }
    const feedbacks = JSON.parse(feedbackData);

    const jobsWithFeedback = jobs.map((job: Job) => {
      return {
        ...job,
        feedback: (feedbacks[userProfileId] || {})[job.index] ?? job.feedback,
      };
    });
    recommendedJobs = recommendJobs(userProfile, jobsWithFeedback);
    jobRecommendationsCache[userProfileId] = recommendedJobs;
    console.log('Recommended jobs calculated and cached');
  } else {
    console.log('Recommended jobs fetched from cache');
  }

  res.status(200).json(recommendedJobs);
};

export const updateJobRecommendationsRoute = async (
  req: Request,
  res: Response
) => {
  const { userId, userProfileId, likedJobs, dislikedJobs } = req.body;

  if (!userId || !userProfileId) {
    return res.status(400).json({
      error: 'User ID and user profile ID are required',
    });
  }

  const userProfile = await getUserProfileById(userProfileId);

  if (!userProfile) {
    return res.status(404).json({ error: 'User profile not found' });
  }

  // Read existing feedbacks
  let feedbackData;
  try {
    feedbackData = fs.readFileSync(
      path.resolve(__dirname, '..', 'data', 'feedback.json'),
      'utf8'
    );
  } catch (err) {
    feedbackData = '{}';
  }
  const feedbacks = JSON.parse(feedbackData);

  // Prepare the new feedback
  const newFeedback: { [index: number]: string } = {};

  likedJobs.forEach((job: Job) => {
    newFeedback[job.index] = 'Like';
  });

  dislikedJobs.forEach((job: Job) => {
    newFeedback[job.index] = 'Dislike';
  });

  // Update the feedbacks data with the new feedback for the current user
  feedbacks[userProfileId] = newFeedback;

  fs.writeFileSync(
    path.resolve(__dirname, '..', 'data', 'feedback.json'),
    JSON.stringify(feedbacks)
  );

  const jobsWithFeedback = jobs.map((job: Job) => {
    return {
      ...job,
      feedback: (feedbacks[userProfileId] || {})[job.index] ?? job.feedback,
    };
  });

  const recommendedJobs = recommendJobs(
    userProfile,
    jobsWithFeedback,
    likedJobs,
    dislikedJobs
  );

  jobRecommendationsCache[userProfileId] = recommendedJobs;

  console.log('Updated recommended jobs calculated and cached');

  res.status(200).json(recommendedJobs);
};
