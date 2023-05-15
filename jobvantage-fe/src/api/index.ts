import axios, { AxiosError } from 'axios';

interface UserCredentials {
  username: string;
  password: string;
}

export async function register(credentials: UserCredentials): Promise<any> {
  try {
    const response = await axios.post(`/register`, credentials);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Error: ${error.response?.statusText}`);
    } else {
      throw new Error(`Error: ${error}`);
    }
  }
}

export async function login(credentials: UserCredentials): Promise<any> {
  try {
    const response = await axios.post(`/login`, credentials);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Error: ${error.response?.statusText}`);
    } else {
      throw new Error(`Error: ${error}`);
    }
  }
}
