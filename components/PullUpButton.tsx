import { Button, Center, Icon, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { signIn, useSession } from 'next-auth/client';
import React, { useState } from 'react'
import { BiMessageAltAdd } from 'react-icons/bi';
import { PullUpForm } from "./";

interface Props {
  mapInstance: google.maps.Map;
}

export const PullUpButton = (props: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [locationData, setLocationData] = useState({} as GeolocationPosition)
  const [session, loading] = useSession();

  const handleOpen = () => {
    // if (!session) { //flip this logic and force user to login once wired up
    //   signIn()
    // } else {
    navigator.geolocation &&
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position)
          setLocationData(position)
        },
        (error) => {
          console.log("COULD NOT GET LOCATION")
          console.log(error)
        },
        { enableHighAccuracy: true }
      );
    onOpen();
      // }
  };

  return (
    <>
      <IconButton
        position="absolute"
        bottom="10rem"
        right="10px"
        borderRadius="50%"
        colorScheme="yellow"
        aria-label="Add PullUp"
        onClick={handleOpen}
      >
        <Icon as={BiMessageAltAdd} />
      </IconButton>
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          {!loading && session ? (
            <>
              <ModalHeader>Pull Up!</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <PullUpForm
                  onClose={onClose}
                  locationData={locationData}
                  uid={session.id as string}
                  userName={session.user.name}
                />
              </ModalBody>
            </>
          ) : (
            <Center padding="22">
              <Button onClick={() => signIn()}>Register / Log In</Button>
            </Center>
          )}
        </ModalContent>
      </Modal>

      {/* {(closestListing && toggleDisplay) && <ClosestCard closestListing={closestListing}/>} */}
      {/* {(closestListing && toggleDisplay) && <ClosestList closestListing={closestListing}/>} */}
    </>
  );
}
