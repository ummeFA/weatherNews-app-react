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
  const handleLogoClick = () => {
    window.location.reload(); // Refresh the page
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
        color: "white",
      }}
    >
      {/* Clickable Logo Section */}
      <Box
        onClick={handleLogoClick}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer", // Pointer on hover
        }}
      >
        <img
          src="../../public/images/cloud.png"
          alt="Weather Logo"
          style={{ height: 40, width: 40, objectFit: "contain" }}
        />
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Weather News
        </Typography>
      </Box>

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
              input: { color: "white" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "white" },
                "&:hover fieldset": { borderColor: "white" },
                "&.Mui-focused fieldset": { borderColor: "white" },
              },
              "& .MuiInputLabel-root": {
                color: "white",
              },
            }}
          />
        )}
        sx={{
          width: 250,
          "& .MuiAutocomplete-popupIndicator": { color: "white" },
          "& .MuiAutocomplete-clearIndicator": { color: "white" },
        }}
        PopperComponent={(props) => (
          <Popper
            {...props}
            modifiers={[{ name: "offset", options: { offset: [0, 6] } }]}
            sx={{
              "& .MuiAutocomplete-paper": {
                backgroundColor: "#132238",
                color: "white",
              },
              "& .MuiAutocomplete-option": {
                color: "white",
                "&[aria-selected='true']": {
                  backgroundColor: "#132238",
                },
                "&:hover": {
                  border: "2px solid white",
                  borderRadius: 1,
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
