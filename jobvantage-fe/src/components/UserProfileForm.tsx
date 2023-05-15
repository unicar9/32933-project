import React, { FC, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  Container,
  Textarea,
} from '@chakra-ui/react';

import { useForm } from 'react-hook-form';

interface FormValues {
  title: string;
  location: string;
  description: string;
}

interface UserProfileFormProps {
  initialValues?: Partial<FormValues>;
  onSubmit?: (data: FormValues) => void;
}

export const UserProfileForm: FC<UserProfileFormProps> = ({
  initialValues,
  onSubmit = (data: FormValues) => {
    console.log('Form data:', data);
  },
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (initialValues) {
      for (const key in initialValues) {
        setValue(key as keyof FormValues, (initialValues as any)[key]);
      }
    }
  }, [initialValues, setValue]);

  return (
    <Container mt={10}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.title} pb={4}>
          <FormLabel>Job Title</FormLabel>
          <Input
            type="text"
            {...register('title', { required: 'Job title is required' })}
          />
          <FormHelperText>
            Please provide your ideal job title (e.g., Senior React Developer)
          </FormHelperText>
          <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.location} pb={4}>
          <FormLabel>Location</FormLabel>
          <Input
            type="text"
            {...register('location', {
              required: 'Location is required',
            })}
          />
          <FormHelperText>
            Please provide a city and state name in Australia (e.g., Sydney, New
            South Wales).
          </FormHelperText>
          <FormErrorMessage>{errors.location?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.description} pb={4}>
          <FormLabel>Description</FormLabel>
          <Textarea
            {...register('description', {
              required: 'Description is required',
            })}
          />
          <FormHelperText>
            Please provide a brief description of your skills and ideal job
            (e.g., Experienced software developer skilled in Python and
            JavaScript, seeking a full-stack developer role in a dynamic tech
            company).
          </FormHelperText>
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>
        <Button type="submit">Submit</Button>
      </form>
    </Container>
  );
};
