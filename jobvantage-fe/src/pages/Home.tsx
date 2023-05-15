import React from 'react';
import {
  Box,
  Flex,
  Heading,
  useColorModeValue,
  Text,
  Button,
} from '@chakra-ui/react';
import { Blob } from '../components/Blob';
import { Link } from 'react-router-dom';

export const Home = () => {
  const gradientBg = useColorModeValue(
    'linear(to-r, white, teal.100)',
    'linear(to-r, white, teal.100)'
  );

  const titleColor = useColorModeValue('white', 'whiteAlpha.900');
  const sloganColor = useColorModeValue('whiteAlpha.800', 'whiteAlpha.700');

  return (
    <Box
      minHeight="100vh"
      display="grid"
      placeItems="center"
      bgGradient={gradientBg}
    >
      <Blob />
      <Flex flexDirection="column" alignItems="center" zIndex={2}>
        <Heading
          as="h1"
          fontSize={['3xl', '4xl', '5xl']}
          fontWeight="bold"
          color={titleColor}
        >
          Jobvantage
        </Heading>
        <Text
          as="h2"
          fontSize={['md', 'lg', 'xl']}
          fontWeight="medium"
          color={sloganColor}
          mt={2}
        >
          Unlock your career advantage
        </Text>
        <Flex align="center" justifyContent="center" p={4}>
          <Link to="/login">
            <Button w={32} colorScheme="whiteAlpha" mr={4}>
              Log in
            </Button>
          </Link>
          <Link to="/register">
            <Button w={32} colorScheme="whiteAlpha">
              Register
            </Button>
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};
