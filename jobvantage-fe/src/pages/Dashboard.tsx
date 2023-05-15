import React, { useState, useEffect } from 'react';
import { Box, SimpleGrid } from '@chakra-ui/react';
import { Header } from '../components/Header';
import { UserProfileCard } from '../components/UserProfileCard';
import { deleteUserProfileById, getAllUserProfiles } from '../api/userProfile';

import { UserProfile } from '../api/userProfile';
import { useToast } from '@chakra-ui/react';

export const Dashboard = () => {
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const toast = useToast();

  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        const profiles = await getAllUserProfiles();
        setUserProfiles(profiles);
      } catch (error) {
        console.error('Error fetching user profiles:', error);
      }
    };

    fetchUserProfiles();
  }, []);

  const handleDeleteUserProfile = async (id: string) => {
    deleteUserProfileById(id);

    toast({
      title: 'Profile deleted',
      description: 'The profile has been successfully deleted.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    try {
      const profiles = await getAllUserProfiles();
      console.log('profiles: ', profiles);
      setUserProfiles(profiles);
    } catch (error) {
      console.error('Error fetching user profiles after deletion:', error);
    }
  };

  return (
    <Box>
      <Header />
      <Box p={4}>
        <SimpleGrid
          spacing={4}
          templateColumns="repeat(auto-fill, minmax(500px, 1fr))"
        >
          <UserProfileCard isNew title={''} location={''} description={''} />
          {userProfiles.map((profile, index) => (
            <UserProfileCard
              key={index}
              {...profile}
              handleDeleteUserProfile={(id) => handleDeleteUserProfile(id)}
            />
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};
