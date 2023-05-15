import React, { FC } from 'react';
import {
  Button,
  Text,
  Heading,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  IconButton,
  Box,
} from '@chakra-ui/react';
import { UserProfile } from '../api/userProfile';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';

interface UserProfileCardProps extends UserProfile {
  isNew?: boolean;
  handleDeleteUserProfile?: (id: string) => void;
}

export const UserProfileCard: FC<UserProfileCardProps> = ({
  id,
  title,
  location,
  description,
  isNew,
  handleDeleteUserProfile,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onDeleteUserProfile = () => {
    if (handleDeleteUserProfile) {
      handleDeleteUserProfile(id!);
      onClose();
    }
  };

  const renderDeleteProfileModal = () => {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete the profile?</ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={onDeleteUserProfile}>
              Confirm
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  return (
    <>
      {isNew ? (
        <Card align="center" justifyContent="center" minH={60}>
          <Link to="/edit-profile">
            <AddIcon boxSize={100} color="teal.500" />
          </Link>
        </Card>
      ) : (
        <Card minH={60}>
          <CardHeader
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Heading size="md">{title}</Heading>
            <Box>
              <Link to="/edit-profile" state={{ userProfileId: id }}>
                <IconButton
                  size="sm"
                  variant="outline"
                  colorScheme="teal"
                  aria-label="Edit Profile"
                  icon={<EditIcon />}
                  mx={2}
                />
              </Link>
              <IconButton
                size="sm"
                variant="outline"
                colorScheme="teal"
                aria-label="Delete Profile"
                icon={<DeleteIcon />}
                onClick={onOpen}
              />
            </Box>
          </CardHeader>
          <CardBody>
            <Heading size="xs" textTransform="uppercase">
              {location}
            </Heading>
            <Text pt="2" fontSize="sm">
              {description}
            </Text>
          </CardBody>
          <CardFooter justifyContent="space-between">
            <Link to="/recommendations" state={{ userProfileId: id }}>
              <Button bgGradient="linear(to-l, #2af598, #009efd)">
                See Job Recommendations
              </Button>
            </Link>
          </CardFooter>
        </Card>
      )}
      {isOpen && renderDeleteProfileModal()}
    </>
  );
};
