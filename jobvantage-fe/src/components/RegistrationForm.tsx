import React, { FC } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Container,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

interface FormValues {
  username: string;
  password: string;
}

interface RegistrationFormProps {
  submitButtonText: string;
  onSubmit?: (data: FormValues) => void;
}

const passwordValidation = (value: string) => {
  return value.length >= 6 || 'Password must be at least 6 characters';
};

export const RegistrationForm: FC<RegistrationFormProps> = ({
  submitButtonText,
  onSubmit = (data: FormValues) => {
    console.log('Form data:', data);
  },
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  return (
    <Container mt={100}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.username} pb={4}>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            {...register('username', { required: 'Username is required' })}
          />
          <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.password} pb={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            {...register('password', {
              required: 'Password is required',
              validate: passwordValidation,
            })}
          />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>
        <Button type="submit">{submitButtonText}</Button>
      </form>
    </Container>
  );
};
