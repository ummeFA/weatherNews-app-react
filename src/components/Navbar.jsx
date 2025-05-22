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
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: { xs: "center", sm: "space-between" },
        alignItems: "center",
        p: 2,
        color: "white",
        gap: { xs: 2, sm: 0 },
        textAlign: { xs: "center", sm: "left" },
      }}
    >
      {/* Clickable Logo Section */}
      <Box
        onClick={handleLogoClick}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        <img
          src="/images/cloud.png"
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
          width: { xs: 180, sm: 250, md: 300 },
          "& .MuiAutocomplete-popupIndicator": { color: "white" },
          "& .MuiAutocomplete-clearIndicator": { color: "white" },
        }}
      />
    </Box>
  );
};

export default Navbar;
