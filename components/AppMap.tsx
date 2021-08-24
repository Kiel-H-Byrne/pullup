import React, { useState, memo } from "react";

import { GoogleMap, LoadScript, MarkerClusterer } from "@react-google-maps/api";
import { Libraries } from "@react-google-maps/api/dist/utils/make-load-script-url";

import MyMarker from "./MyMarker";
import MyInfoWindow from "./InfoWindow";
import { GEOCENTER, MAP_STYLES } from "../util/constants";
import { AspectRatio, Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Image, useDisclosure } from "@chakra-ui/react";
import { GLocation, PullUp } from "../types";
import { AdvancedVideo } from "@cloudinary/react";
import useSWR from "swr";
import fetcher from "../util/fetch";
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
  clientLocation: GLocation;
  setMapInstance: any;
  mapInstance: any;
}

const AppMap = memo(({
  clientLocation,
  setMapInstance,
}: IAppMap) => {
  const { isOpen: isDrawerOpen, onOpen: setDrawerOpen, onClose: setDrawerClose } = useDisclosure()
  const { isOpen: isWindowOpen, onToggle: toggleWindow, onClose: setWindowClose } = useDisclosure()
  const [activeData, setActiveData] = useState(null as PullUp);

  let { center, zoom, options } = defaultProps;
  const uri = clientLocation ? `api/pullups?lat=${clientLocation.lat}&lng=${clientLocation.lng}` : null;

  const { data, error } = useSWR(uri, fetcher);
  const pullups: PullUp[] = !error && data?.pullups;
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
        {pullups && (
          <MarkerClusterer
            styles={clusterStyles}
            enableRetinaIcons
            // onClick={(event) =>{console.log(event.getMarkers())}}
            gridSize={2}
          // minimumClusterSize={3}
          >
            {(clusterer) =>
              Object.values(pullups).map((data) => {
                //return marker if element categories array includes value from selected_categories\\

                // if ( //if closeby
                // pullup.categories &&
                // pullup.categories.some((el) => selectedCategories.has(el))
                // && mapInstance.containsLocation(listings.location)
                // ) {
                // if (pullup.location) {
                //   const [lat, lng] = pullup.location.split(",");

                //   let isInside = new window.google.maps.LatLngBounds().contains(
                //     { lat: +lat, lng: +lng }
                //   );
                //   // console.log(isInside);
                // }
                return (
                  // return (
                  //   pullup.categories
                  //     ? pullup.categories.some((el) =>
                  //         selected_categories.includes(el)
                  //       )
                  //     : false
                  // ) ? (

                  <MyMarker
                    key={`marker-${data._id}`}
                    //@ts-ignore
                    data={data}
                    clusterer={clusterer}
                    activeData={activeData}
                    setActiveData={setActiveData}
                    setWindowClose={setWindowClose}
                    toggleWindow={toggleWindow}
                    setDrawerOpen={setDrawerOpen}
                  />
                );
                // }
              })
            }
          </MarkerClusterer>
        )}
        {activeData && isWindowOpen && <MyInfoWindow activeData={activeData} />}

        {activeData && isDrawerOpen && (
          <Drawer
            // activeData={activeData}
            isOpen={isDrawerOpen}
            placement="left"
            onClose={setDrawerClose}
          // mapInstance={mapInstance}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Info</DrawerHeader>
              <DrawerBody>
                <Box>
                  {activeData.media && <RenderMedia media={activeData.media} />}
                </Box>
                {activeData.message}
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        )}

        {/* <HeatmapLayer map={this.state.map && this.state.map} data={data.map(x => {x.location})} /> */}
      </GoogleMap>
    </LoadScript>
  );
});

export default AppMap;

const RenderMedia = ({ media }: { media: PullUp['media'] }) => {
  console.log(media)
  if (media) {
    switch (media.type) {
      case "video":
        return (<AspectRatio> <video controls><source src={media.uri} />Your browser does not support the video tag.</video></AspectRatio>);
        break;
      case "image":
        return <Image src={media.uri} />;
        break;
      case "audio":
        return <audio src={media.uri} />;
        break;

      default:
        console.log(media.type)
        return <div>Unrecognized Media</div>
        break;
    }
  }
};
