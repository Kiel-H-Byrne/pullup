import { Button, Icon, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/client';
import React, { useState } from 'react'
import { BiMessageAltAdd } from 'react-icons/bi';
import useSWR, { mutate } from 'swr';
import { PullUp } from '../types';

interface Props {
  mapInstance: google.maps.Map;
  uid: number;
}

export const PullUpButton = (props: Props) => {
  const { mapInstance, uid } = props;
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [locationData, setLocationData] = useState({} as GeolocationPosition)
  const [session, loading] = useSession();

  const handleOpen = () => {
    if (!!session) { //flip this logic and force user to login once wired up
      console.log("must login first")
      signIn()
    } else {
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
      }
  };

  const handleSubmit = async () => {
    //get geoPoint, place on map with message metadata
    //show x or check, if wrong, get accurate point. if right, show modal
    //load modal w/ form
    //on form submit, place pin on map, pan to new pin, wait, pan back to user's location
    const formData: PullUp = {
      pid: "dfaef",
      uid: "234jf23",
      message: "First PullUp!",
      location: {
        lat: locationData.coords.latitude,
        lng: locationData.coords.longitude,
      },
      timestamp: new Date(locationData.timestamp),
    };
    // console.log(mapInstance)
    console.log(formData);
    const apiUri = `/api/pullups?lat=${locationData.coords.latitude}&lng=${locationData.coords.longitude}`
    mutate(
      apiUri,
      await axios.post(apiUri, {
        data: { uid, ...formData},
      })
    );
    mutate(apiUri);

    onClose();
  }
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
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <label htmlFor="message">Message</label><Input name="message"/>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="yellow" mr={3} onClick={handleSubmit}>
              Send
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* {(closestListing && toggleDisplay) && <ClosestCard closestListing={closestListing}/>} */}
      {/* {(closestListing && toggleDisplay) && <ClosestList closestListing={closestListing}/>} */}

    </>
  );
}
