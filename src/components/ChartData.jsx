import React from "react";
import { Typography, Box } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

const ChartData = ({ chartData }) => {
  if (!chartData || chartData.length === 0) return null;

  return (
    <>
      {/* Align text to the right above the chart */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Typography variant="h6" sx={{ color: "white" }}>
          Temperature Forecast (Next 24 Hours)
        </Typography>
      </Box>

      {/* Larger full-width chart */}
      <Box sx={{ width: "100%" }}>
        <LineChart
          xAxis={[
            {
              scaleType: "point",
              data: chartData.map((d) => d.time),
              tickLabelStyle: { fill: "white" }, // x-axis labels
            },
          ]}
          yAxis={[
            {
              tickLabelStyle: { fill: "white" }, // y-axis labels
            },
          ]}
          series={[
            {
              data: chartData.map((d) => d.temp),
              label: "Temperature (°C)",
            },
          ]}
          width={window.innerWidth * 0.85}
          height={400}
          sx={{
            ".MuiChartsAxis-label, .MuiChartsLegend-root, .MuiChartsTooltip-root":
              {
                color: "white",
                fill: "white",
              },
          }}
        />
      </Box>
    </>
  );
};

export default ChartData;
