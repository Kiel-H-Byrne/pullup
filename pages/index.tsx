import React from "react";
import { Layout } from "../components";
import { useState } from "react";
import AppMap from "../components/AppMap";

const IndexPage = () => {
  const [clientLocation, setClientLocation] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  return (
    <>
      <Layout title="Pull Up!">
        <AppMap
          clientLocation={clientLocation}
          mapInstance={mapInstance}
          setMapInstance={setMapInstance}
          setClientLocation={setClientLocation}
        />
      </Layout>
    </>
  );
};

export default IndexPage;
