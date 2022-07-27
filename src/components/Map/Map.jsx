import React from "react";
import {
  MapContainer,
  Popup,
  TileLayer,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { Paper, Typography, useMediaQuery } from "@material-ui/core";
import { LocationOnOutlined } from "@material-ui/icons";
import Rating from "@material-ui/lab/Rating";

import useStyle from "./styles";

const Map = ({
  setCoordinates,
  setBounds,
  coordinates,
  places,
  setChildClicked,
  isRequestPlace,
}) => {
  const isDesktop = useMediaQuery("(min-width:600px)");
  const classes = useStyle();

  function OnLocationChange() {
    const map = useMapEvents({
      click() {
        setCoordinates({ lat: map.getCenter().lat, lng: map.getCenter().lng });
        setBounds({
          ne: map.getBounds().getNorthEast(),
          sw: map.getBounds().getSouthWest(),
        });
      },
    });

    return null;
  }

  function ChangeCity() {
    const map = useMap();
    map.setView(coordinates);

    return null;
  }

  return (
    <div className={classes.mapContainer}>
      <MapContainer
        style={{ height: "100%" }}
        center={coordinates}
        zoom={13}
        whenReady={(map) => {
          setBounds({
            ne: map.target.getBounds().getNorthEast(),
            sw: map.target.getBounds().getSouthWest(),
          });
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <OnLocationChange />
        {isRequestPlace && <ChangeCity />}
        {places?.map(
          (place, i) =>
            place?.latitude && (
              <Popup
                closeButton={false}
                autoClose={false}
                position={[Number(place.latitude), Number(place.longitude)]}
                className={classes.markerContainer}
                key={place.location_id}
              >
                {!isDesktop ? (
                  <LocationOnOutlined color="primary" fontSize="large" />
                ) : (
                  <Paper
                    elevation={3}
                    className={classes.paper}
                    onClick={() => setChildClicked(i)}
                  >
                    <Typography
                      className={classes.typography}
                      variant="subtitle2"
                      gutterBottom
                    >
                      {place.name}
                    </Typography>
                    <img
                      className={classes.pointer}
                      src={place.photo && place.photo.images.large.url}
                      alt={place.name}
                    />
                    <Rating
                      size="small"
                      value={Number(place.rating)}
                      readOnly
                    />
                  </Paper>
                )}
              </Popup>
            )
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
