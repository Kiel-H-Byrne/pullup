import { MarkerClusterer } from "@react-google-maps/api";
import { Clusterer } from '@react-google-maps/marker-clusterer';
import React, { useCallback, useEffect, useState } from "react";
import { GLocation, PullUp } from "../types";
import MyMarker from "./MyMarker";
import MyInfoWindow from "./InfoWindow";
import { MyDrawer } from './MyDrawer';
import { useDisclosure } from "@chakra-ui/react";
import { checkForOverlaps, makeLocationStringKey } from "../util/helpers";

interface ClustererState {
  markerClusterer: Clusterer | null;
}

export function MyClusterer({
  clusterStyles,
  pullups,
  mapInstance,
}: {
  clusterStyles: any,
  pullups: PullUp[],
  mapInstance: google.maps.MapOptions
}) {

  const [infoWindowPosition, setInfoWindowPosition] = useState(null as google.maps.LatLng);
  const { isOpen: isWindowOpen, onToggle: toggleWindow, onClose: setWindowClose } = useDisclosure();
  const { isOpen: isDrawerOpen, onOpen: toggleDrawer, onClose: setDrawerClose } = useDisclosure();
  const [iwData, setIwData] = useState(null as PullUp[]);
  const [dupes, setDupes] = useState(null as { [key: string]: PullUp[] });

  useEffect(() => {
    //create object of dupes in shape of [{position: Pullups[]}] (an array of objects, each with a key of the shared location of each marker (marker center))
    if (pullups) {
      const duplicates = checkForOverlaps(pullups)
      setDupes(duplicates)
    }
    console.log("rendering..", dupes)
  }, [pullups])

  const onClick = (e: ClustererState) => {
    const clusterCenter = e.markerClusterer.clusters[0].center;
    setInfoWindowPosition(clusterCenter)
    
    const clusterKey = makeLocationStringKey({ 'lat': clusterCenter.lat(), 'lng': clusterCenter.lng() })
    // console.log("i've clicked..open the drawer", dupes[clusterKey])
    if (mapInstance.zoom == mapInstance.maxZoom) {
      //if map zoom is max, and still have cluster, 
      //onClick/Touch make Drawer with multiple listings...
      setIwData(dupes[clusterKey])
      toggleDrawer();
      if (iwData) {
        // const clusterCenter = JSON.parse(JSON.stringify(e.markerClusterer.clusters[0].center));
      } else {
        console.log("no data")
      }
    }
  }

  const handleMouseOver = (e: ClustererState) => {
    // onHOver make infowindow with multiple listings...
    const clusterCenter = e.markerClusterer.clusters[0].center;
    setInfoWindowPosition(clusterCenter)
    
    const clusterKey = makeLocationStringKey({ 'lat': clusterCenter.lat(), 'lng': clusterCenter.lng() })
    setIwData(dupes[clusterKey])
    toggleWindow()
    //there may be potential for this to not work as expected if multiple groups of markers closeby instead of one?
    // e.markerclusterer.markers.length //length should equal pullups length with close centers (within 5 sig dig)
    // console.log(JSON.stringify(iwData[0].location)
  }
  const handleMouseOut = () => {
    if (infoWindowPosition) {
      // setWindowPosition(null)
      setWindowClose()
    }
  }


  return (
    <React.Fragment>
      <MarkerClusterer styles={clusterStyles} averageCenter enableRetinaIcons gridSize={30} //how big the square of a cluster is in pixels //60
        onClick={onClick}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      // onClick={(event) =>{console.log(event.getMarkers())}}
      // minimumClusterSize={2} //how many need to be in before it makes a cluster //2
      >
        {clusterer => pullups.map(pullup => {
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
          return (// return (
            //   pullup.categories
            //     ? pullup.categories.some((el) =>
            //         selected_categories.includes(el)
            //       )
            //     : false
            // ) ? (
            <MyMarker key={`marker-${pullup._id}`}
              data={pullup} // label={}
              // title={}
              clusterer={clusterer} setWindowClose={setWindowClose} setIwData={setIwData} toggleWindow={toggleWindow} toggleDrawer={toggleDrawer} />
          ); // }
        })}
      </MarkerClusterer>;
      {iwData && isWindowOpen && <MyInfoWindow activeData={iwData} clusterCenter={infoWindowPosition} />}
      {iwData && isDrawerOpen && (
        <MyDrawer isDrawerOpen={isDrawerOpen} setDrawerClose={setDrawerClose} activeData={iwData} />
      )}
    </React.Fragment>
  )
}