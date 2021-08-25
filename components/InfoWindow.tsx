import React from "react";
import { InfoWindow } from "@react-google-maps/api";
import { PullUp } from "../types";
import { Box, Flex, Progress, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/client";
import { RenderMedia } from "./RenderMedia";

const MyInfoWindow = ({ activeData }: { activeData: PullUp }) => {
  const { location, uid, userName } = activeData;
  const [session, loading] = useSession()
  // let loc = location.split(",");
  // let locObj = { lat: parseFloat(loc[0]), lng: parseFloat(loc[1]) };

  return (
    <InfoWindow
      position={location}
      options={{
        pixelOffset: { height: -40, width: 0, equals: void (0) },
        disableAutoPan: true,
      }}
    >
      {activeData ? (
        <Flex width="xs" direction="column">
          {activeData.media && <RenderMedia media={activeData.media} options={{ title: activeData.message.substr(0, 11), autoplay: true, }} />}
          <Text as="h2">{activeData.message}</Text>
          <Text fontWeight="light" fontSize=".7rem" color="gray.300">{userName} </Text>
        </Flex>
      ) : (
        <Progress />
      )}
    </InfoWindow>
  );
};

export default React.memo(MyInfoWindow);
