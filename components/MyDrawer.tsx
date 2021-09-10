import { Box, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { MdPersonPinCircle } from "react-icons/md";
import { InteractiveUserName } from "./InteractiveUserName";
import { RenderMedia } from "./RenderMedia";
export function MyDrawer({
  isDrawerOpen,
  setDrawerClose,
  activeData
}) {
  return <Drawer isOpen={isDrawerOpen} placement="left" onClose={setDrawerClose}>
    <DrawerOverlay />
    <DrawerContent>
      <DrawerCloseButton />
      <DrawerHeader>
        <Flex dir="row"><MdPersonPinCircle /> Info</Flex>
      </DrawerHeader>
      <DrawerBody p={0}>
        {activeData.length > 1 ? activeData.map((el, i) => {
          const {
            media,
            message,
            userName
          } = el;
          return <Box key={i} p={0} marginBlock={3} bgColor="goldenrod" boxShadow="xl" width={"100%"}>
            <Flex direction="column">
              {media && <Box paddingBlock={1}><RenderMedia media={media} options={{
                title: message.substr(0, 11)
              }} /></Box>}
              <Box p={1}><Text as="h2">{message}</Text>
                {
                  /* <InteractiveUserName userName={userName} uid={uid} /> */
                }
                <Text fontWeight="semibold" fontSize=".7rem" color="gray.500">@{userName} - {new Date(el.timestamp).toLocaleDateString()} </Text>
              </Box></Flex>
          </Box>;
        }) : <> <Box>
          {activeData[0].media && <RenderMedia media={activeData[0].media} options={{
            title: activeData[0].message.substr(0, 11)
          }} />}
        </Box>
          {activeData[0].message}
          <InteractiveUserName userName={activeData[0].userName} uid={activeData[0].uid} /></>}
      </DrawerBody>
    </DrawerContent>
  </Drawer>;
}
