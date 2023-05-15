import axios, { AxiosError } from 'axios';

export interface UserProfile {
  id?: string;
  userId?: string;
  title: string;
  location: string;
  description: string;
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

export async function createUserProfile(
  userProfile: UserProfile
): Promise<any> {
  try {
    const response = await apiClient.post(`/user-profile`, userProfile);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function updateUserProfile(
  userProfile: UserProfile
): Promise<any> {
  try {
    const response = await apiClient.put(`/user-profile`, userProfile);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function deleteUserProfileById(
  userProfileId: string
): Promise<any> {
  try {
    const response = await apiClient.delete(`/user-profile/${userProfileId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getAllUserProfiles(): Promise<any> {
  try {
    const response = await apiClient.get(`/user-profile`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getUserProfileById(id: string): Promise<any> {
  try {
    const response = await apiClient.get(`/user-profile/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}
