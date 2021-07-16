import React from 'react'
import useSWR from 'swr'
import { PullUp } from '../types';
import fetcher from '../util/fetch';
import { getTruncated } from '../util/helpers'

interface Props {
  mapInstance: google.maps.Map
}

export const MarkersLayer = (props: Props) => {
  const { mapInstance } = props;
  //make api call using user's location
  const userLocation = { lat: 0, lng: 0 };
  const uri = `api/pullups?${
    !userLocation
      ? ``
      : `lat=${getTruncated(userLocation.lat)}&lng=${getTruncated(
          userLocation.lng
        )}`
  }`;

  const { data } = useSWR(uri, fetcher);
  const markers = data && data.pullups.forEach((el: PullUp) => {
  new (window as any).google.maps.Marker({
    position: el.location,
    map: mapInstance,
    // icon:
  });
  });

//display on map

  return <div></div>;
}
