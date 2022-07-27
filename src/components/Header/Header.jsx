import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputAdornment,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { Autocomplete, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BingProvider } from "leaflet-geosearch";

import useStyles from "./styles";

const Header = ({
  setCoordinates,
  setIsRequestPlace,
  setBounds,
  weatherData,
}) => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
    },
  });
  const classes = useStyles();

  const [places, setPlaces] = useState([]);

  const provider = new BingProvider({
    params: {
      key: process.env.REACT_APP_BING_PROVIDER_API_KEY,
    },
  });

  const select = (placeName) => {
    provider.search({ query: placeName }).then(function (result) {
      setCoordinates({ lat: result[0].y, lng: result[0].x });
      setBounds({
        sw: { lat: result[0].bounds[1][0], lng: result[0].bounds[1][1] },
        ne: { lat: result[0].bounds[0][0], lng: result[0].bounds[0][1] },
      });
      setIsRequestPlace(true);
    });
  };

  const search = (query) => {
    provider.search({ query: query }).then(function (result) {
      setPlaces(result);
    });
  };

  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>
        <Typography variant="h5" className={classes.title}>
          Travel Advisor
        </Typography>
        <Typography>
          Temprature:{" "}
          {weatherData
            ? `${Math.round(weatherData?.main?.feels_like)}°C`
            : "Unavailable"}
        </Typography>
        <Box display="flex">
          <Typography variant="h6" className={classes.title}>
            Explore new places
          </Typography>
          <div className={classes.search}>
            <ThemeProvider theme={theme}>
              <Autocomplete
                freeSolo
                disablePortal
                id="combo-box-demo"
                onChange={(e) => select(e.target.textContent)}
                options={places}
                sx={{ width: 200 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search..."
                    InputProps={{
                      ...params.InputProps,
                      style: { color: "white" },
                      startAdornment: (
                        <InputAdornment
                          style={{ color: "white" }}
                          position="start"
                        >
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    onChange={(e) => search(e.target.value)}
                    size="small"
                  />
                )}
              />
            </ThemeProvider>
          </div>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
