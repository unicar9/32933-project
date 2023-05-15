import axios, { AxiosError } from 'axios';

export interface RecommendationsReq {
  userProfileId: string;
}

export interface FeedbackReq {
  likedJobs: Job[];
  dislikedJobs: Job[];
  userProfileId: string;
}

export interface Job {
  company: string;
  description: string;
  index: number;
  jobType: string;
  link: string;
  list: string[];
  title: string;
  location: string;
  feedback: 'Like' | 'Dislike' | undefined;
}

const apiClient = axios.create({
  baseURL: '/',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const handleError = (error: any) => {
  if (error instanceof AxiosError) {
    throw new Error(`Error: ${error.response?.statusText}`);
  } else {
    throw new Error(`Error: ${error}`);
  }
};

export async function createJobRecommendations(
  recommendationsReq: RecommendationsReq
): Promise<Job[] | undefined> {
  try {
    const response = await apiClient.post(
      `/recommendations`,
      recommendationsReq
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function sendFeedback(
  feedbackReq: FeedbackReq
): Promise<Job[] | undefined> {
  try {
    const response = await apiClient.post(`/feedback`, feedbackReq);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}
