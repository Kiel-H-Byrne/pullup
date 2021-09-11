import React, { useEffect } from "react";

import { Marker, MarkerProps } from "@react-google-maps/api";

interface IMyMarker {
  data: any;
  setIwData: any;
  clusterer: any;
  setWindowClose: any;
  toggleWindow: any;
  toggleDrawer: any;
}

const MyMarker = ({
  data,
  clusterer,
  setIwData,
  setWindowClose,
  toggleWindow,
  toggleDrawer,
}: IMyMarker) => {
  let loc;
  const { location, _id } = data;
  // location ? (loc = location.split(",")) : (loc = "50.60982,-1.34987");
  // let locObj = { lat: parseFloat(loc[0]), lng: parseFloat(loc[1]) };
  let image = {
    url: "img/orange_marker_sm.png",
  };

  const handleMouseOverMarker = () => {
    console.log("doesn't work on click...")
    setIwData([data])
    toggleWindow();
  };
  const handleMouseOut = () => {
    setWindowClose();
  };
  const handleClickMarker = () => {
    setIwData([data])
    toggleDrawer();
  };
  return (
    <div className="App-marker" key={_id}>
      <Marker
        position={location}
        clusterer={clusterer}
        icon={image}
        onMouseOver={handleMouseOverMarker}
        onMouseDown={handleClickMarker}
        onMouseOut={handleMouseOut}
        // onMouseOut={(e) => {console.log(e)}}
        // onClick={handleClickMarker}
        //@ts-ignore
        // __data={data}
        // visible={categories.some((el) => selectedCategories.has(el))} //check for if category matches selected categories
      />
    </div>
  );
};

export default React.memo(MyMarker);
