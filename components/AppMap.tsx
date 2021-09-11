import { MyClusterer } from './MyClusterer';
import React, { useState, memo } from "react";
import { GoogleMap, GoogleMapProps, LoadScript, MarkerClusterer } from "@react-google-maps/api";
import { Libraries } from "@react-google-maps/api/dist/utils/make-load-script-url";
import { GEOCENTER, MAP_STYLES } from "../util/constants";
import { Text, useDisclosure, useToast } from "@chakra-ui/react";
import { GLocation, PullUp } from "../types";
import useSWR from "swr";
import fetcher from "../util/fetch";
import { LocateMeButton } from "./LocateMeButton";
const LIBRARIES: Libraries = ["places", "visualization", "geometry", "localContext"];

const clusterStyles = [
  {
    url: "img/m1.png",
    height: 53,
    width: 53,
    anchor: [26, 26],
    textColor: "#000",
    textSize: 11,
  },
  {
    url: "img/m2.png",
    height: 56,
    width: 56,
    anchor: [28, 28],
    textColor: "#000",
    textSize: 11,
  },
  {
    url: "img/m3.png",
    height: 66,
    width: 66,
    anchor: [33, 33],
    textColor: "#000",
    textSize: 11,
  },
  {
    url: "img/m4.png",
    height: 78,
    width: 78,
    anchor: [39, 39],
    textColor: "#000",
    textSize: 11,
  },
  {
    url: "img/m5.png",
    height: 90,
    width: 90,
    anchor: [45, 45],
    textColor: "#000",
    textSize: 11,
  },
];

const defaultProps = {
  center: GEOCENTER,
  zoom: 5, //vs 11
  options: {
    // mapTypeId:google.maps.MapTypeId.TERRAIN,
    backgroundColor: "#555",
    clickableIcons: false,
    disableDefaultUI: true,
    fullscreenControl: false,
    zoomControl: true,
    // zoomControlOptions: {
    //   position: window.google.maps.ControlPosition.RIGHT_CENTER,
    // },
    mapTypeControl: false,
    // mapTypeControlOptions: {
    //   style: window.google.maps.MapTypeControlStyle.DROPDOWN_MENU,
    //   position: window.google.maps.ControlPosition.RIGHT_CENTER,
    //   mapTypeIds: ['roadmap', 'terrain']
    // },
    scaleControl: false,
    rotateControl: true,
    streetViewControl: false,
    // streetViewControlOptions: {
    //   position: window.google.maps.ControlPosition.BOTTOM_CENTER,
    // },
    //gestureHandling sets the mobile panning on a scrollable page: COOPERATIVE, GREEDY, AUTO, NONE
    gestureHandling: "greedy",
    scrollwheel: true,
    maxZoom: 18,
    minZoom: 4, //3 at mobbv0
    // Map styles; snippets from 'Snazzy Maps'.
    styles: MAP_STYLES.whiteMono
  },
};

interface IAppMap {
  setClientLocation: any;
  clientLocation: GLocation;
  setMapInstance: any;
  mapInstance: GoogleMapProps & any;
}

const AppMap = memo(({
  setClientLocation,
  clientLocation,
  setMapInstance,
  mapInstance,
}: IAppMap) => {

  let { center, zoom, options } = defaultProps;
  const uri = clientLocation ? `/api/pullups?lat=${clientLocation.lat}&lng=${clientLocation.lng}` : null;
  // const uri = clientLocation ? `/api/pullups?lat=${getTruncated(clientLocation.lat)}&lng=${getTruncated(clientLocation.lng)}` : null;
  const { data: fetchData, error } = useSWR(uri, fetcher, { loadingTimeout: 1000, errorRetryCount: 3 });
  if (error) {
    console.warn(error)
  }
  const pullups: PullUp[] = !error && fetchData?.pullups;
  const toast = useToast();

  if (pullups) { toast.closeAll(); }
  return (
    // Important! Always set the container height explicitly via mapContainerClassName
    <LoadScript
      id="script-loader"
      googleMapsApiKey={process.env.GOOGLE_API_KEY}
      language="en"
      region="us"
      libraries={LIBRARIES}
    >
      <GoogleMap
        onLoad={(map) => {
          // const bounds = new window.google.maps.LatLngBounds();
          setMapInstance(map);
        }}
        id="GMap"
        // mapContainerClassName={style.map}
        center={clientLocation || center}
        zoom={clientLocation ? 16 : zoom}
        options={options}
      >
        {/* {listings && (
          <MapAutoComplete
            listings={listings}
            categories={categories}
            mapInstance={mapInstance}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        )} */}
        {clientLocation && !pullups && toast({ title: "Searching...", status: "info" })}
        {clientLocation && pullups && pullups.length == 0 && toast({ title: "No Results", status: "info" })}
        {clientLocation && pullups && pullups.length !== 0 && (
          <MyClusterer clusterStyles={clusterStyles} pullups={pullups} mapInstance={mapInstance}/>
        )}

        {/* <HeatmapLayer map={this.state.map && this.state.map} data={data.map(x => {x.location})} /> */}
      </GoogleMap>
      <LocateMeButton
        pullups={pullups}
        mapInstance={mapInstance}
        clientLocation={clientLocation}
        setClientLocation={setClientLocation}
      />
    </LoadScript>
  );
});

export default AppMap;