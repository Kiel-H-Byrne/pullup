import React from "react";
import { InfoWindow } from "@react-google-maps/api";
import { PullUp } from "../types";
import { Box, Progress, Text } from "@chakra-ui/react";

const MyInfoWindow = ({ activeData }: { activeData: PullUp }) => {
  const { location } = activeData;
  // let loc = location.split(",");
  // let locObj = { lat: parseFloat(loc[0]), lng: parseFloat(loc[1]) };

  return (
    <InfoWindow
      position={location}
      options={{
        pixelOffset: { height: -40, width: 0, equals: void(0)},
        disableAutoPan: true,
      }}
    >
      {activeData ? (
        <div className={""}>
          <Box><Text >{activeData.message}</Text></Box>
        </div>
      ) : (
        <Progress />
      )}
    </InfoWindow>
  );
};

export default React.memo(MyInfoWindow);
