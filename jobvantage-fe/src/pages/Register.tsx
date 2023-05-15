import { Box } from '@chakra-ui/react';
import { Header } from '../components/Header';
import { RegistrationForm } from '../components/RegistrationForm';
import { register } from '../api';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const handleRegister = async (data: {
    username: string;
    password: string;
  }) => {
    try {
      const response = await register(data);
      console.log('Register successful:', response);

      localStorage.setItem('token', response.token);

      toast({
        title: 'Registered',
        description: 'You have successfully registered.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Register error:', error.message);
      } else {
        console.error('Register error:', error);
      }

      toast({
        title: 'Register error',
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
      <RegistrationForm submitButtonText="Register" onSubmit={handleRegister} />
    </Box>
  );
};
