import React, { FC, useState, useEffect } from 'react';
import { Box, Heading } from '@chakra-ui/react';

import {
  getUserProfileById,
  UserProfile,
  updateUserProfile,
  createUserProfile,
} from '../api/userProfile';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { UserProfileForm } from '../components/UserProfileForm';
import { useToast } from '@chakra-ui/react';

interface FormValues {
  title: string;
  location: string;
  description: string;
}

export const EditProfile: FC = () => {
  const toast = useToast();

  const location = useLocation();
  const userProfileId = location.state?.userProfileId;
  console.log('userProfileId: ', userProfileId);
  const isEditMode = !!userProfileId;
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (userProfileId) {
        try {
          const profile = await getUserProfileById(userProfileId);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [userProfileId]);

  const handleFormSubmit = async (data: FormValues) => {
    console.log('data: ', data);
    try {
      if (isEditMode && userProfile) {
        const updatedUserProfile = { ...userProfile, ...data };
        console.log('updatedUserProfile: ', updatedUserProfile);
        await updateUserProfile(updatedUserProfile);
        console.log('User profile updated:', updatedUserProfile);

        toast({
          title: 'Profile updated',
          description: 'The user profile has been successfully updated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        navigate('/dashboard');
      } else {
        const newUserProfile = await createUserProfile(data);
        console.log('User profile created:', newUserProfile);

        toast({
          title: 'Profile created',
          description: 'A new user profile has been successfully created.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: 'Profile creation error',
        description:
          error instanceof Error ? error.message : 'An error occurred.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });

      console.error('Error:', error);
    }
  };

  return (
    <Box>
      <Header />
      <Heading textAlign="center" mt={10}>
        {isEditMode ? 'Edit User Profile' : 'Create User Profile'}
      </Heading>
      <Box>
        <UserProfileForm
          initialValues={userProfile as any}
          onSubmit={handleFormSubmit}
        />
      </Box>
    </Box>
  );
};
