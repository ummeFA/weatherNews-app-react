import React from "react";
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  Popper,
} from "@mui/material";
import { cities } from "../data/cities";

const Navbar = ({ city, setCity }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
        color: "white",
        // boxShadow: 1,
      }}
    >
      {/* Website Logo */}
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        WeatherApp
      </Typography>

      {/* City Search Dropdown */}
      <Autocomplete
        options={cities}
        getOptionLabel={(opt) => opt.name}
        value={city}
        onChange={(_, v) => v && setCity(v)}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Search city"
            sx={{
              borderRadius: 1,
              minWidth: 200,
              input: { color: "white" }, // white input text
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white", // white border
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
              "& .MuiInputLabel-root": {
                color: "white",
              },
            }}
          />
        )}
        sx={{
          width: 250,
          "& .MuiAutocomplete-popupIndicator": {
            color: "white", // white dropdown icon
          },
          "& .MuiAutocomplete-clearIndicator": {
            color: "white", // white clear (X) icon
          },
        }}
        PopperComponent={(props) => (
          <Popper
            {...props}
            modifiers={[
              {
                name: "offset",
                options: {
                  offset: [0, 6],
                },
              },
            ]}
            sx={{
              "& .MuiAutocomplete-paper": {
                backgroundColor: "#456789", // Match your navbar background
                color: "white",
              },
              "& .MuiAutocomplete-option": {
                color: "white",
                "&[aria-selected='true']": {
                  backgroundColor: "#345678", // selected color
                },
                "&:hover": {
                  backgroundColor: "#345678", // hover color
                },
              },
            }}
          />
        )}
      />
    </Box>
  );
};

export default Navbar;
