import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const WeatherCard = ({ city, temperature, condition }) => {
  if (!city || temperature === null || condition === "") return null;

  return (
    <Card
      sx={{
        width: 300,
        mt: 4,
        bgcolor: "#4b6e8b", // Dark background
        color: "white", // Default font color for content
        border: "2px solid white",
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Box textAlign="center">
          <Typography variant="h5">{city.name}</Typography>

          <Typography variant="h2" sx={{ color: "white" }}>
            {temperature}°C
          </Typography>

          <Typography variant="h6" sx={{ color: "white" }}>
            {condition}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
