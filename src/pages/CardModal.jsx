import React from "react";
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";

const getCondition = (code) => {
  if (code === 0) return "Sunny";
  if (code < 50) return "Cloudy";
  return "Rain";
};

const CardModal = ({ open, onClose, day }) => {
  if (!day) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#152238",
          color: "white",
          p: 3,
          borderRadius: 2,
          width: {
            xs: "calc(100% - 32px)",
            sm: "90%",
            md: "400px",
          },
          maxWidth: {
            xs: "none",
            sm: 400,
          },
          boxShadow: 24,
          outline: "none",
          maxHeight: {
            xs: "calc(100vh - 64px)",
            sm: "auto",
          },
          overflow: "auto",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          textAlign="center"
          sx={{ mt: 1, fontWeight: "bold" }}
        >
          Weather Details : {day.date}
        </Typography>

        <List dense>
          <ListItem>
            <ListItemText
              primary={`Condition: ${getCondition(day.weatherCode)}`}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary={`Max Temp: ${day.tempMax}°C`} />
          </ListItem>
          <ListItem>
            <ListItemText primary={`Min Temp: ${day.tempMin}°C`} />
          </ListItem>
          <ListItem>
            <ListItemText primary={`Humidity: ${day.humidity}%`} />
          </ListItem>
          <ListItem>
            <ListItemText primary={`Precipitation: ${day.precipitation} mm`} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={`Visibility: ${
                day.visibility !== undefined
                  ? `${Math.round(day.visibility)} m`
                  : "N/A"
              }`}
            />
          </ListItem>
        </List>

        {/* Close Button */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: {
              xs: "center", // center on mobile
              sm: "flex-end", // right on larger screens
            },
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "white",
              borderWidth: "2px",
              px: 3,
              py: 1,
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "white",
                transform: "scale(1.05)", // 👈 slightly enlarge
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CardModal;
