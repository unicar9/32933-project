import React, { FC } from 'react';
import {
  Box,
  Button,
  Flex,
  useColorModeValue,
  Heading,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export const Header: FC = () => {
  const bg = useColorModeValue('teal.50', 'gray.800');
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 1) {
          ref.current?.classList.add('sticky');
        } else {
          ref.current?.classList.remove('sticky');
        }
      },
      { threshold: [1] }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Box ref={ref} bg={bg} boxShadow="md" zIndex="3" w="100%">
      <Flex align="center" justifyContent="space-between" p={4}>
        <Link to="/">
          <Heading
            fontSize="2xl"
            fontWeight="extrabold"
            bgClip="text"
            bgGradient="linear(to-l, #2af598, #009efd)"
          >
            Jobvantage
          </Heading>
        </Link>
        <Box>
          <Link to="/login">
            <Button colorScheme="teal" variant="solid" mr={4}>
              Log in
            </Button>
          </Link>
          <Link to="/register">
            <Button colorScheme="teal" variant="outline">
              Register
            </Button>
          </Link>
        </Box>
      </Flex>
    </Box>
  );
};
