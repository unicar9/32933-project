import { Box } from '@chakra-ui/react';
import { Header } from '../components/Header';
import { RegistrationForm } from '../components/RegistrationForm';
import { login } from '../api';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async (data: { username: string; password: string }) => {
    try {
      const response = await login(data);
      console.log('Login successful:', response);

      localStorage.setItem('token', response.token);

      toast({
        title: 'Logged in',
        description: 'You have successfully logged in.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Login error:', error.message);
      } else {
        console.error('Login error:', error);
      }

      toast({
        title: 'Login error',
        description:
          error instanceof Error ? error.message : 'An error occurred.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Header />
      <RegistrationForm submitButtonText="Log in" onSubmit={handleLogin} />
    </Box>
  );
};
