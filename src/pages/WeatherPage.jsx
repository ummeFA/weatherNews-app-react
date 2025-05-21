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
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&hourly=temperature_2m,precipitation,relative_humidity_2m&timezone=GMT`;

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

          return {
            date,
            tempMax: data.daily.temperature_2m_max[i],
            tempMin: data.daily.temperature_2m_min[i],
            weatherCode: data.daily.weathercode[i],
            humidity: Math.round(avgHumidity),
            precipitation: totalPrecip.toFixed(1),
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

  // background: "linear-gradient(to bottom right, #152238, #364154)",
  return (
    <Box
      sx={{
        bgcolor: "#152238",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to bottom right, #152238, #364154)",
        color: "white",
      }}
    >
      {loading ? (
        <CircularProgress sx={{ color: "white" }} size={60} thickness={5} />
      ) : (
        <Box
          maxWidth="lg"
          sx={{
            py: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Navbar city={city} setCity={setCity} />
          <Typography variant="h4" mt={4}>
            {city.name} - 7 Day Forecast
          </Typography>
          <WeatherCarousel
            city={city}
            data={dailyData}
            onCardClick={handleCardClick}
          />
          <ChartData chartData={chartData} selectedDate={selectedDate} />
        </Box>
      )}
    </Box>
  );
};
//
export default WeatherPage;
