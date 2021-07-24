import React from 'react'
import useSWR from 'swr'
import { GLocation, PullUp } from '../types';
import fetcher from '../util/fetch';
import { getTruncated } from '../util/helpers'

interface Props {
  mapInstance: google.maps.Map,
  clientLocation: GLocation,
}

export const MarkersLayer = (props: Props) => {
  const { mapInstance, clientLocation } = props;
  if (!clientLocation) {
    return null;
  } else {
    //make api call using user's location
    const uri = `api/pullups?lat=${clientLocation.lat}&lng=${clientLocation.lng}`;

    const { data, error } = useSWR(uri, fetcher);
    data &&
      data.pullups.forEach((el: PullUp) => {
        new (window as any).google.maps.Marker({
          position: el.location,
          map: mapInstance,
          // icon:
        });
      });
    //display on map
    return <div></div>;
  }
};
