import React, { Component, useRef, useState } from "react";
import { Key } from "./../../utils/key";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  LoadScript,
  InfoWindow,
  StandaloneSearchBox,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

const position = {
  lat: -3.745,
  lng: -38.523,
};

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: Key,
    libraries: ["places"],
  });

  const [map, setMap] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const onLoad = React.useCallback(function callback(map: any) {
    const bounds = new window.google.maps.LatLngBounds(center);
    // map.fitBounds(bounds);
    setMap(map);
  }, []);
  const [searchBox, setSearchBox] = useState(null);
  const onSBLoad = (ref) => {
    setSearchBox(ref);
  };

  function hanldePlacesChanged() {
    if (!searchBox) return;
    const places = searchBox.getPlaces();
    console.log(places);
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    console.log(bounds);
  }

  const onUnmount = React.useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Marker
        onLoad={onLoad}
        position={position}
        onClick={(marker) => {
          setActiveMarker(marker as any);
        }}
      />
      <InfoWindow position={position} marker={activeMarker}>
        <div>
          <h1>hiiiii</h1>
        </div>
      </InfoWindow>
      <></>
      <StandaloneSearchBox
        onLoad={onSBLoad}
        onPlacesChanged={hanldePlacesChanged}
      >
        <input
          type="text"
          placeholder="Customized your placeholder"
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `240px`,
            height: `32px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
            position: "absolute",
            left: "50%",
            marginLeft: "-120px",
            top: "100px",
          }}
        />
      </StandaloneSearchBox>
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(MyComponent);
