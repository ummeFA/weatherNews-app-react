import { useEffect, useState } from "react";
import { cities } from "../data/cities";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Autocomplete,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { addDays } from "date-fns";

const WeatherCard = () => {
  const [city, setCity] = useState(cities[0]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTemp, setCurrentTemp] = useState(null);
  const [time, setTime] = useState("");
  const [condition, setCondition] = useState("Loading...");
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!city || !selectedDate) return;
    setCurrentTemp(null); // Show loader

    const fetchWeather = async () => {
      const { lat, lon } = city;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode&timezone=GMT`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        // Format selectedDate to match API datetime: "YYYY-MM-DDTHH:mm"
        const selectedISOString = selectedDate.toISOString().slice(0, 13); // e.g., "2025-05-20T14"

        // Find index in data.hourly.time[] matching selected hour
        const index = data.hourly.time.findIndex((t) =>
          t.startsWith(selectedISOString)
        );

        if (index !== -1) {
          const temp = data.hourly.temperature_2m[index];
          const weatherCode = data.hourly.weathercode[index];
          const rawTime = data.hourly.time[index];

          setCurrentTemp(temp);
          setTime(rawTime);
          setCondition(
            weatherCode === 0
              ? "Sunny ☀️"
              : weatherCode < 50
              ? "Cloudy ☁️"
              : "Rain 🌧️"
          );
        } else {
          setCurrentTemp("N/A");
          setTime("No data available for selected date/time");
          setCondition("N/A");
        }

        // Chart preview
        // Build chart for next 24 hours from selected date
        const selectedISODate = selectedDate.toISOString().slice(0, 13); // "YYYY-MM-DDTHH"
        const startIndex = data.hourly.time.findIndex((t) =>
          t.startsWith(selectedISODate)
        );

        if (startIndex !== -1) {
          const chartSlice = data.hourly.time
            .slice(startIndex, startIndex + 24)
            .map((t, i) => ({
              time: t.slice(11, 16), // show "HH:mm"
              temp: data.hourly.temperature_2m[startIndex + i],
            }));
          setChartData(chartSlice);
        } else {
          setChartData([]); // fallback if no match found
        }
      } catch (error) {
        console.error("Weather API error:", error);
      }
    };

    fetchWeather();
  }, [city, selectedDate]);

  if (currentTemp === null) {
    return (
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f5f5f5",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          width: "100vw",
          minHeight: "100vh",
          bgcolor: "#f5f5f5",
          p: 4,
          boxSizing: "border-box",
        }}
      >
        {/* Controls */}
        <Box display="flex" gap={2} alignItems="center" mb={3}>
          <Autocomplete
            options={cities}
            getOptionLabel={(opt) => opt.name}
            value={city}
            onChange={(_, v) => v && setCity(v)}
            renderInput={(params) => <TextField {...params} label="City" />}
            sx={{ width: 200 }}
          />

          <DatePicker
            disablePast
            maxDate={addDays(new Date(), 6)}
            label="Select Date"
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
            renderInput={(params) => <TextField {...params} />}
          />

          <Button
            variant="contained"
            onClick={() => setShowChart((prev) => !prev)}
          >
            {showChart ? "Hide Chart" : "Show Chart"}
          </Button>
        </Box>

        {/* Weather Info Card */}
        <Card sx={{ width: "100%", mb: 3 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              flexDirection={{ xs: "column", md: "row" }}
              gap={2}
            >
              {/* Left */}
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
              >
                <Typography variant="h4">{city.name}</Typography>
                <Typography variant="h2" color="primary">
                  {`${currentTemp}°C`}
                </Typography>
                <Typography color="text.secondary">{time}</Typography>
              </Box>

              {/* Right */}
              <Box display="flex" justifyContent="center" alignItems="center">
                <Typography variant="h4">{condition}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Chart Card */}
        {showChart && (
          <Card sx={{ width: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Temperature Forecast (next 24 hours)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis unit="°C" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#1976d2"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default WeatherCard;
