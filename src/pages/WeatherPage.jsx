import React, { useEffect, useState } from "react";
import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { cities } from "../data/cities";
import Navbar from "../components/Navbar";
import WeatherCarousel from "../components/WeatherCarousel";
import ChartData from "../components/ChartData";

const WeatherPage = () => {
  const [city, setCity] = useState(cities[0]);
  const [dailyData, setDailyData] = useState([]);
  const [hourlyData, setHourlyData] = useState({});
  const [chartData, setChartData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      if (!city) return;

      const { lat, lon } = city;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&hourly=temperature_2m,precipitation,visibility,relative_humidity_2m&timezone=GMT`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        const grouped = {};
        data.hourly.time.forEach((t, i) => {
          const date = t.slice(0, 10);
          const time = t.slice(11, 16);
          if (!grouped[date]) grouped[date] = [];
          grouped[date].push({
            time,
            temp: data.hourly.temperature_2m[i],
            precipitation: data.hourly.precipitation[i],
            humidity: data.hourly.relative_humidity_2m[i],
            visibility: data.hourly.visibility[i], // ✅ Added this line
          });
        });
        setHourlyData(grouped);

        const daily = data.daily.time.map((date, i) => {
          const entries = grouped[date] || [];
          const avgHumidity =
            entries.reduce((sum, d) => sum + (d.humidity || 0), 0) /
            (entries.length || 1);
          const totalPrecip = entries.reduce(
            (sum, d) => sum + (d.precipitation || 0),
            0
          );

          // ✅ Fixed visibility calculation
          const avgVisibility =
            entries.length > 0
              ? entries.reduce((sum, d) => sum + (d.visibility || 0), 0) /
                entries.length
              : 0;

          return {
            date,
            tempMax: data.daily.temperature_2m_max[i],
            tempMin: data.daily.temperature_2m_min[i],
            weatherCode: data.daily.weathercode[i],
            humidity: Math.round(avgHumidity),
            precipitation: totalPrecip.toFixed(1),
            visibility: Math.round(avgVisibility), // ✅ Simplified and fixed
          };
        });

        setDailyData(daily);

        const today = new Date().toISOString().slice(0, 10);
        setSelectedDate(today);
        setChartData(grouped[today] || []);
      } catch (err) {
        console.error("Error fetching weather data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  const handleCardClick = (date) => {
    setSelectedDate(date);
    setChartData(hourlyData[date] || []);
  };

  return (
    <Box
      sx={{
        bgcolor: "#152238",
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(to bottom right, #152238, #364154)",
        color: "white",
        px: 2, // padding for small devices
      }}
    >
      {loading ? (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress sx={{ color: "white" }} size={60} thickness={5} />
        </Box>
      ) : (
        <Container
          maxWidth="lg"
          sx={{
            py: { xs: 4, sm: 6 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Navbar city={city} setCity={setCity} />
          <Typography
            variant="h4"
            mt={2}
            textAlign="center"
            fontSize={{ xs: "1.5rem", sm: "2rem", md: "2.5rem" }}
          >
            {city.name} - 7 Day Forecast
          </Typography>
          <WeatherCarousel
            city={city}
            data={dailyData}
            onCardClick={handleCardClick}
          />
          <ChartData chartData={chartData} selectedDate={selectedDate} />
        </Container>
      )}
    </Box>
  );
};

export default WeatherPage;
