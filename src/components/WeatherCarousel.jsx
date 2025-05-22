import React, { useRef, useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import CardModal from "../pages/CardModal"; // adjust path if needed

const getCondition = (code) => {
  if (code === 0) return "Sunny ";
  if (code < 50) return "Cloudy ";
  return "Rain ";
};

const getWeatherIcon = (code) => {
  if (code === 0) return "/images/sunny.png";
  if (code < 50) return "/images/cloudy.png";
  return "/images/rain.png";
};

const getDisplayDate = (dateStr) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const formattedToday = today.toISOString().slice(0, 10);
  const formattedTomorrow = tomorrow.toISOString().slice(0, 10);

  if (dateStr === formattedToday) return "Today";
  if (dateStr === formattedTomorrow) return "Tomorrow";
  return dateStr;
};

const WeatherCarousel = ({ city, data, onCardClick }) => {
  const scrollRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const checkScrollPosition = () => {
    const container = scrollRef.current;
    if (container) {
      setAtStart(container.scrollLeft === 0);
      setAtEnd(
        Math.ceil(container.scrollLeft + container.clientWidth) >=
          container.scrollWidth
      );
    }
  };

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleDoubleClick = (day) => {
    setSelectedDay(day);
    setOpenModal(true);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    checkScrollPosition();
    container.addEventListener("scroll", checkScrollPosition);
    return () => container.removeEventListener("scroll", checkScrollPosition);
  }, []);

  if (!data || data.length === 0) return null;

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <IconButton
        onClick={() => scroll("left")}
        disabled={atStart}
        sx={{
          position: "absolute",
          top: "50%",
          left: -10,
          zIndex: 1,
          transform: "translateY(-50%)",
          backgroundColor: "transparent",
          color: "white",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
        }}
      >
        <ChevronLeft fontSize="large" />
      </IconButton>

      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2,
          py: 2,
          px: { xs: "calc(50vw - 140px)", sm: 4 },
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          scrollSnapType: { xs: "x mandatory", sm: "none" },
        }}
      >
        {data.map((day, index) => (
          <Card
            key={index}
            onClick={() => onCardClick(day.date)}
            onDoubleClick={() => handleDoubleClick(day)}
            sx={{
              width: 280,
              minWidth: 280,
              maxWidth: 280,
              flexShrink: 0,
              scrollSnapAlign: { xs: "center", sm: "none" },
              bgcolor: "#152238",
              color: "white",
              border: "2px solid white",
              borderRadius: 2,
              cursor: "pointer",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                borderColor: "white",
              },
            }}
          >
            <CardContent sx={{ position: "relative", minHeight: 150 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 0.5,
                }}
              >
                <img
                  src={getWeatherIcon(day.weatherCode)}
                  alt="weather-icon"
                  style={{ height: 36, width: 36, display: "block" }}
                />
                <Typography
                  variant="h6"
                  sx={{ lineHeight: 1, fontSize: "1rem" }}
                >
                  {getCondition(day.weatherCode)}
                </Typography>
              </Box>

              <Typography variant="h4" my={1}>
                {day.tempMin}°C / {day.tempMax}°C
              </Typography>

              <Box sx={{ position: "absolute", top: 20, right: 20 }}>
                <Typography variant="body2" sx={{ fontSize: 15 }}>
                  {getDisplayDate(day.date)}
                </Typography>
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  bottom: 20,
                  right: 20,
                  textAlign: "right",
                }}
              >
                <Typography variant="body2" sx={{ fontSize: 16 }}>
                  💧 {day.precipitation} mm
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 16 }}>
                  💨 {day.humidity}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <IconButton
        onClick={() => scroll("right")}
        disabled={atEnd}
        sx={{
          position: "absolute",
          top: "50%",
          right: -10,
          zIndex: 1,
          transform: "translateY(-50%)",
          backgroundColor: "transparent",
          color: "white",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
        }}
      >
        <ChevronRight fontSize="large" />
      </IconButton>

      {/* Card modal shown on double click */}
      <CardModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        day={selectedDay}
      />
    </Box>
  );
};

export default WeatherCarousel;
