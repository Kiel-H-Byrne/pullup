import React, { useState, memo } from "react";

import { GoogleMap, GoogleMapProps, LoadScript, MarkerClusterer } from "@react-google-maps/api";
import { Libraries } from "@react-google-maps/api/dist/utils/make-load-script-url";

import MyMarker from "./MyMarker";
import MyInfoWindow from "./InfoWindow";
import { GEOCENTER, MAP_STYLES } from "../util/constants";
import { AspectRatio, Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, Image, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { GLocation, PullUp } from "../types";
import useSWR from "swr";
import fetcher from "../util/fetch";
import { InteractiveUserName } from "./InteractiveUserName";
import { RenderMedia } from "./RenderMedia";
import { useCallback } from "react";
import { LocateMeButton } from "./LocateMeButton";
import { MdPersonPinCircle } from "react-icons/md";
import { useEffect } from "react";
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
  const { isOpen: isDrawerOpen, onOpen: toggleDrawer, onClose: setDrawerClose } = useDisclosure();
  const { isOpen: isWindowOpen, onToggle: toggleWindow, onClose: setWindowClose } = useDisclosure();
  const [infoWindowPosition, setInfoWindowPosition] = useState(null as GLocation);
  const [iwData, setIwData] = useState(null as PullUp[]);
  let { center, zoom, options } = defaultProps;
  const uri = clientLocation ? `/api/pullups?lat=${clientLocation.lat}&lng=${clientLocation.lng}` : null;
  // const uri = clientLocation ? `/api/pullups?lat=${getTruncated(clientLocation.lat)}&lng=${getTruncated(clientLocation.lng)}` : null;
  const { data: fetchData, error } = useSWR(uri, fetcher, { loadingTimeout: 1000, errorRetryCount: 3 });
  if (error) {
    console.warn(error)
  }
  const pullups: PullUp[] = !error && fetchData?.pullups;
  const toast = useToast();

  const toThreePlaces = (num: number) => num.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0]

  useEffect(() => {
    const dupes = pullups && checkForOverlaps(pullups)
    setIwData(dupes)
  }, [pullups])


  const checkForOverlaps = useCallback((data: PullUp[]) => {
    const result: { [key: string]: PullUp[] } = data.reduce(function (r, a) {
      const locString = `{lng: ${toThreePlaces(a.location.lng)}, lat: ${toThreePlaces(a.location.lat)}}`
      r[locString] = r[locString] || [];
      r[locString].push(a);
      return r;
    }, Object.create(null) as { [key: string]: PullUp[] });
    const iwData = Object.values(result).find(el => el.length > 1);
    return iwData;
  }, [pullups])
  if (pullups) { toast.closeAll(); }

  const onClick = (e: any) => {
    if (mapInstance.zoom == mapInstance.maxZoom) {
      //if map zoom is max, and still have cluster, make infowindow with multiple listings...
      // (tab through cards of pins that sit on top of each other)
      // console.log("i've clicked..open the drawer", iwData)
      if (iwData) {
        toggleDrawer()
      } else {
        console.log("no data")
      }
    }
  }

  // const handleMouseOver = (e: any) => {
  //   if (mapInstance.zoom == mapInstance.maxZoom) {
  //     //there may be potential for this to not work as expected if multiple groups of markers closeby instead of one?
  //     // e.markerclusterer.markers.length //length should equal pullups length with close centers (within 5 sig dig)
  //     const clusterCenter = e.markerClusterer.clusters[0].center;
  //     // const clusterCenter = JSON.parse(JSON.stringify(e.markerClusterer.clusters[0].center));
  //     setInfoWindowPosition(clusterCenter)
  //     // console.log(JSON.stringify(iwData[0].location))
  //     iwData && setIwData(iwData)
  //     iwData && toggleWindow()
  //   }
  // }
  // const handleMouseOut = () => {
  //   if (infoWindowPosition) {
  //     // setWindowPosition(null)
  //     toggleWindow()
  //   }
  // }
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
          <MarkerClusterer
            styles={clusterStyles}
            averageCenter
            enableRetinaIcons
            gridSize={30} //how big the square of a cluster is in pixels //60
            onClick={onClick}
          // onMouseOver={handleMouseOver}
          // onMouseOut={handleMouseOut}
          // onClick={(event) =>{console.log(event.getMarkers())}}
          // minimumClusterSize={2} //how many need to be in before it makes a cluster //2
          >
            {(clusterer) =>
              pullups.map((markerData) => {
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
                    key={`marker-${markerData._id}`}
                    //what data can i set on marker?
                    data={markerData}
                    // label={}
                    // title={}
                    clusterer={clusterer}
                    activeData={iwData}
                    setActiveData={setIwData}
                    setWindowClose={setWindowClose}
                    toggleWindow={toggleWindow}
                    toggleDrawer={toggleDrawer}
                  />
                );
                // }
              })
            }
          </MarkerClusterer>
        )}
        {iwData && isWindowOpen && <MyInfoWindow activeData={iwData} clusterCenter={infoWindowPosition} />}

        {iwData && isDrawerOpen && (
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
              <DrawerHeader>
                <Flex dir="row"><MdPersonPinCircle /> Info</Flex>
              </DrawerHeader>
              <DrawerBody p={0}>
                {iwData.length > 1
                  ?
                  iwData.map((el, i) => {
                    const { media, message, userName } = el;
                    return (
                      <Box key={i} p={0} marginBlock={3} bgColor="goldenrod" boxShadow="xl" width={"100%"}>
                        <Flex direction="column">
                          {media && <Box paddingBlock={1}><RenderMedia media={media} options={{
                            title: message.substr(0, 11),
                          }} /></Box>}
                          <Box p={1}><Text as="h2">{message}</Text>
                            {/* <InteractiveUserName userName={userName} uid={uid} /> */}
                            <Text fontWeight="semibold" fontSize=".7rem" color="gray.500">@{userName} - {new Date(el.timestamp).toLocaleDateString()} </Text>
                          </Box></Flex>
                      </Box>)
                  })
                  // </Tabs>
                  :
                  (<> <Box>
                    {iwData[0].media && <RenderMedia media={iwData[0].media} options={{ title: iwData[0].message.substr(0, 11) }} />}
                  </Box>
                    {iwData[0].message}
                    <InteractiveUserName userName={iwData[0].userName} uid={iwData[0].uid} /></>)
                }
              </DrawerBody>
            </DrawerContent>
          </Drawer>
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