import React from "react";
import { InfoWindow } from "@react-google-maps/api";
import { PullUp } from "../types";
import { Box, Progress, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/client";
import { InteractiveUserName } from "./InteractiveUserName";

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
        <Box>
          <InteractiveUserName uid={uid} userName={userName} /><Text >{activeData.message}</Text></Box>
      ) : (
        <Progress />
      )}
    </InfoWindow>
  );
};

export default React.memo(MyInfoWindow);
