import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import { cities } from "../data/cities";
import Navbar from "../components/Navbar";
import WeatherCard from "../components/WeatherCard";
import ChartData from "../components/ChartData";

const WeatherPage = () => {
  const [city, setCity] = useState(cities[0]);
  const [currentTemp, setCurrentTemp] = useState(null);
  const [condition, setCondition] = useState("");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!city) return;

      const { lat, lon } = city;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode&timezone=GMT`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        const now = new Date();
        const selectedISO = now.toISOString().slice(0, 13);
        const index = data.hourly.time.findIndex((t) =>
          t.startsWith(selectedISO)
        );

        if (index !== -1) {
          const temp = data.hourly.temperature_2m[index];
          const weatherCode = data.hourly.weathercode[index];

          setCurrentTemp(temp);
          setCondition(
            weatherCode === 0
              ? "Sunny ☀️"
              : weatherCode < 50
              ? "Cloudy ☁️"
              : "Rain 🌧️"
          );

          const next24 = data.hourly.time
            .slice(index, index + 24)
            .map((t, i) => ({
              time: t.slice(11, 16),
              temp: data.hourly.temperature_2m[index + i],
            }));

          setChartData(next24);
        } else {
          setCurrentTemp("N/A");
          setCondition("N/A");
          setChartData([]);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchWeather();
  }, [city]);

  return (
    <Box
      sx={{
        bgcolor: "#4b6e8b",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 4,
        }}
      >
        <Navbar city={city} setCity={setCity} />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            mt: 4,
            gap: 4,
          }}
        >
          <WeatherCard
            city={city}
            temperature={currentTemp}
            condition={condition}
          />
          <ChartData chartData={chartData} />
        </Box>
      </Container>
    </Box>
  );
};

export default WeatherPage;
