import { Box } from "@chakra-ui/react";
import React, { useState } from "react";
import { render } from "react-dom";
import useSWR from "swr";
import { GLocation, PullUp } from "../types";
import fetcher from "../util/fetch";
import { getTruncated } from "../util/helpers";

interface Props {
  mapInstance: google.maps.Map;
  clientLocation: GLocation;
}

const InfoWindow = () => <Box width="container.sm">InfoWIndow Content</Box>;

export const MarkersLayer = (props: Props) => {
  const { mapInstance, clientLocation } = props;
  const [infoWindow, setInfoWindow] = useState(null)
  const createInfoWindow = () => {
    setInfoWindow(new (window as any).google.maps.InfoWindow({
      content: '<div id="infoWindow" />',
      position: {...clientLocation, lat: clientLocation.lat-.05},
    }));
    infoWindow.addListener("domready", () => {
      render(<InfoWindow />, document.getElementById("infoWindow"));
    });
    infoWindow.open(mapInstance);
  };
  if (!clientLocation) {
    return null;
  } else {
    //make api call using user's location
    const uri = `api/pullups?lat=${clientLocation.lat}&lng=${clientLocation.lng}`;

    const { data, error } = useSWR(uri, fetcher);
    data &&
      data.pullups.forEach((el: PullUp) => {
        const marker = new (window as any).google.maps.Marker({
          position: el.location,
          map: mapInstance,
          // title: el.title
          // icon:
        });
        marker.addListener("click", () => {
          createInfoWindow();
        });
      });
    //display on map
    return <div></div>;
  }
};
