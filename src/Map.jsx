import { useState, useEffect, useRef } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const LOCATION_KEY = "geolocation";
const center = { lat: 21.1456496, lng: 105.799524 };

const Map = () => {
  const initLocation = JSON.parse(localStorage.getItem(LOCATION_KEY)) || null;
  const [currentLocation, setCurrentLocation] = useState(null);
  const intervalRef = useRef();
  // laod script for google map
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    if (isLoaded) {
      const interval = setInterval(() => {
        handleGetLocation();
      }, 5000);
      intervalRef.current = interval;
    }
    return () => clearInterval(intervalRef.current);
  }, [isLoaded]);

  if (!isLoaded) return <div>Loading....</div>;

  // get current location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({
            lat: latitude,
            lng: longitude,
          });
          localStorage.setItem(
            LOCATION_KEY,
            JSON.stringify({
              lat: latitude,
              lng: longitude,
            })
          );
        },
        (error) => {
          if (initLocation) {
            setCurrentLocation(initLocation);
          }
          console.log(error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  // on map load
  const onMapLoad = () => {
    handleGetLocation();
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <GoogleMap
        zoom={18}
        center={currentLocation || initLocation || center}
        mapContainerClassName="map"
        mapContainerStyle={{ width: "100vw", height: "90vh" }}
        onLoad={onMapLoad}
      >
        <Marker position={initLocation} />
        {currentLocation && <Marker position={currentLocation} />}
      </GoogleMap>
    </div>
  );
};

export default Map;
