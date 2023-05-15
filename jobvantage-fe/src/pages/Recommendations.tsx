import { useEffect, useState } from 'react';
import { createJobRecommendations } from '../api/jobRecommendations';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Stack,
  Text,
  Link,
  ButtonGroup,
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { CustomPaginator } from '../components/CustomPaginator';
import { ExternalLinkIcon } from '@chakra-ui/icons';

import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import { Job, sendFeedback } from '../api/jobRecommendations';

export const Recommendations = () => {
  const location = useLocation();
  const userProfileId = location.state?.userProfileId;

  const [recommendations, setRecommendations] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const newFeedbackStates: { [index: number]: 'Like' | 'Dislike' | null } =
      {};
    recommendations.forEach((job, i) => (newFeedbackStates[job.index] = null));
    setFeedbackStates(newFeedbackStates);
  }, [recommendations]);

  useEffect(() => {
    const createRecommendations = async () => {
      if (userProfileId) {
        try {
          const newRecommendations = await createJobRecommendations({
            userProfileId,
          });

          if (newRecommendations) {
            console.log('recommendations: ', recommendations);

            const newFeedbackStates: {
              [index: number]: 'Like' | 'Dislike' | null;
            } = {};

            newRecommendations.forEach((job) => {
              newFeedbackStates[job.index] = job.feedback || null;
              console.log('newFeedbackStates: ', newFeedbackStates);
            });

            setFeedbackStates(newFeedbackStates);

            setRecommendations(newRecommendations);
          }
        } catch (error) {
          console.error('Error creating job newRecommendations:', error);
        }
      }
    };

    createRecommendations();
  }, [userProfileId, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const [likedJobs, setLikedJobs] = useState<Job[]>([]);
  const [dislikedJobs, setDislikedJobs] = useState<Job[]>([]);
  const [feedbackStates, setFeedbackStates] = useState<{
    [index: number]: 'Like' | 'Dislike' | null;
  }>({});

  const handleSubmitFeedback = async () => {
    if (userProfileId) {
      try {
        const updatedRecommendations = await sendFeedback({
          likedJobs,
          dislikedJobs,
          userProfileId,
        });

        if (!updatedRecommendations) return;

        const updatedFeedbackStates: {
          [index: number]: 'Like' | 'Dislike' | null;
        } = {};

        updatedRecommendations.forEach((job) => {
          updatedFeedbackStates[job.index] = feedbackStates[job.index] || null;
        });

        setFeedbackStates(updatedFeedbackStates);
        setRecommendations(updatedRecommendations);
      } catch (error) {
        console.error('Error updating job recommendations:', error);
      }
    }
  };

  const handleFeedback = (
    index: number,
    feedback: 'Like' | 'Dislike' | null
  ) => {
    const updatedFeedbackStates = { ...feedbackStates };
    updatedFeedbackStates[index] = feedback;
    setFeedbackStates(updatedFeedbackStates);

    const job = recommendations.find((job) => job.index === index);

    if (job) {
      if (feedback === 'Like') {
        if (feedbackStates[index] === 'Like') {
          setLikedJobs(likedJobs.filter((j) => j.index !== job.index)); // remove job from likedJobs if it was previously liked
        } else {
          setLikedJobs([...likedJobs, job]); // add job to likedJobs
        }
      } else if (feedback === 'Dislike') {
        if (feedbackStates[index] === 'Dislike') {
          setDislikedJobs(dislikedJobs.filter((j) => j.index !== job.index)); // remove job from dislikedJobs if it was previously disliked
        } else {
          setDislikedJobs([...dislikedJobs, job]); // add job to dislikedJobs
        }
      }
    }
  };

  return (
    <Box>
      <Header />
      <Box p={10}>
        <Stack spacing="4">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Heading size="lg">These jobs are recommended for you</Heading>
            <Button
              colorScheme="teal"
              variant="solid"
              m={2}
              onClick={handleSubmitFeedback}
            >
              Submit Feedback
            </Button>
          </Box>

          {recommendations.slice(startIndex, endIndex).map((rec, index) => {
            return (
              <Card key={rec.link}>
                <CardHeader
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="cen"
                >
                  <Box>
                    <Heading size="md" mb={2}>
                      {rec.title}
                    </Heading>
                    <Heading fontSize="sm" textTransform="uppercase">
                      {rec.location}
                    </Heading>
                  </Box>
                  <Box>
                    <ButtonGroup variant="solid" isAttached>
                      <Button
                        leftIcon={<AiFillLike />}
                        colorScheme={
                          feedbackStates[rec.index] === 'Like' ||
                          rec.feedback === 'Like'
                            ? 'green'
                            : 'teal'
                        }
                        variant={
                          feedbackStates[rec.index] === 'Like' ||
                          rec.feedback === 'Like'
                            ? 'solid'
                            : 'outline'
                        }
                        onClick={() => handleFeedback(rec.index, 'Like')}
                      >
                        Like
                      </Button>
                      <Button
                        leftIcon={<AiFillDislike />}
                        colorScheme={
                          feedbackStates[rec.index] === 'Dislike' ||
                          rec.feedback === 'Dislike'
                            ? 'red'
                            : 'teal'
                        }
                        variant={
                          feedbackStates[rec.index] === 'Dislike' ||
                          rec.feedback === 'Dislike'
                            ? 'solid'
                            : 'outline'
                        }
                        onClick={() => handleFeedback(rec.index, 'Dislike')}
                      >
                        Dislike
                      </Button>
                    </ButtonGroup>
                  </Box>
                </CardHeader>
                <CardBody>
                  <Text fontSize="md" mb={2}>
                    {rec.company}
                  </Text>
                  <Text fontSize="sm" noOfLines={3}>
                    {rec.description}
                  </Text>
                </CardBody>
                <CardFooter flexDirection="column">
                  <Link href={rec.link} isExternal color="teal.500">
                    See More <ExternalLinkIcon mx="2px" />
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </Stack>
        <Flex justifyContent="center" mt={4}>
          <CustomPaginator
            onPageChange={onPageChange}
            currentPage={currentPage}
            pageCount={Math.ceil(recommendations.length / itemsPerPage)}
          />
        </Flex>
      </Box>
    </Box>
  );
};
