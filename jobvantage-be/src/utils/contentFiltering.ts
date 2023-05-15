import * as natural from 'natural';
import * as fs from 'fs';
import { removeStopwords } from 'stopword';

export interface Job {
  title: string;
  location: string;
  description: string;
  list: string[];
  index: number;
  feedback: 'Like' | 'Dislike' | undefined;
}

interface User {
  title: string;
  location: string;
  description: string;
}

const createAbbreviations = (locationPart: string): string[] => {
  const words = locationPart.split(' ');
  const abbreviation = words.map((word) => word.charAt(0)).join('');
  const fullWords = words.join('');

  return [abbreviation, fullWords];
};

const compareLocation = (
  userLocation: string,
  jobLocation: string
): boolean => {
  const userLocationParts = userLocation
    .split(',')
    .flatMap(createAbbreviations);

  const jobLocationParts = jobLocation.split(',').flatMap(createAbbreviations);

  for (const userPart of userLocationParts) {
    for (const jobPart of jobLocationParts) {
      if (userPart.toLowerCase() === jobPart.toLowerCase()) {
        return true;
      }
    }
  }

  return false;
};

const processText = (text: string): string[] => {
  const tokenizer = new natural.WordTokenizer();

  const tokens = removeStopwords(tokenizer.tokenize(text.toLowerCase())).map(
    (token: string) => natural.PorterStemmer.stem(token)
  );

  return tokens;
};

const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  const dotProduct = vecA.reduce(
    (acc, value, index) => acc + value * vecB[index],
    0
  );
  const magnitudeA = Math.sqrt(
    vecA.reduce((acc, value) => acc + value * value, 0)
  );
  const magnitudeB = Math.sqrt(
    vecB.reduce((acc, value) => acc + value * value, 0)
  );

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
};

const extractTfidfVector = (tfidf: any, documentIndex: number): number[] => {
  const vector: number[] = [];
  const terms = tfidf.listTerms(documentIndex);
  for (const term of terms) {
    vector.push(term.tfidf);
  }
  return vector;
};

const calculateJobScores = (
  userProfile: User,
  jobs: Job[]
): { job: Job; score: number }[] => {
  const tfidf = new natural.TfIdf();

  tfidf.addDocument(processText(userProfile.description));

  // Add job requirements to the tfidf object
  jobs.forEach((job) => {
    tfidf.addDocument(processText(job.description));
  });

  const jobScores = jobs.map((job, index) => {
    const vecA = extractTfidfVector(tfidf, 0);
    const vecB = extractTfidfVector(tfidf, index + 1);
    const similarity = cosineSimilarity(vecA, vecB);
    return {
      job,
      score: similarity,
    };
  });

  return jobScores;
};

export const recommendJobs = (
  user: User,
  jobs: Job[],
  likedJobs: Job[] = [],
  dislikedJobs: Job[] = [],
  titleThreshold = 0.7,
  topN = 100
): Job[] => {
  const filteredJobs = jobs.filter((job) => {
    const jobTitle = job.title.toLowerCase();
    const userTitle = user.title.toLowerCase();
    const titleSimilarity = natural.JaroWinklerDistance(
      userTitle,
      jobTitle,
      {}
    );
    return titleSimilarity >= titleThreshold;
  });

  const jobScores = calculateJobScores(user, filteredJobs);

  jobScores.forEach((jobScore) => {
    if (compareLocation(user.location, jobScore.job.location)) {
      jobScore.score *= 1.01; // Increase the score by 1% for jobs with matching locations
    }

    if (
      jobScore.job.feedback === 'Like' ||
      likedJobs.some((likedJob) => likedJob.index === jobScore.job.index)
    ) {
      jobScore.score *= 1.2; // Increase the score by 20% for liked jobs
      jobScore.job.feedback = 'Like';
    }

    if (
      jobScore.job.feedback === 'Dislike' ||
      dislikedJobs.some(
        (dislikedJob) => dislikedJob.index === jobScore.job.index
      )
    ) {
      jobScore.score *= 0.6; // Decrease the score by 40% for disliked jobs
      jobScore.job.feedback = 'Dislike';
    }
  });

  // Sort job scores in descending order
  jobScores.sort((a, b) => b.score - a.score);

  // Return the top N jobs
  return jobScores.slice(0, topN).map((jobScore) => jobScore.job);
};
