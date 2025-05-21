import React from "react";
import { Typography, Box } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

const ChartData = ({ chartData }) => {
  if (!chartData || chartData.length === 0) return null;

  const date = new Date().toISOString().slice(0, 10);

  return (
    <Box sx={{ display: "flex", alignItems: "center", width: "100%", mt: 4 }}>
      {/* Chart container with colored background */}
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: "#3d495c",
          borderRadius: 2,
          padding: 2,
        }}
      >
        <LineChart
          grid={{ horizontal: true }}
          tooltip={{
            show: true,
            showCrosshairs: true,
            showContent: true,
            trigger: "axis",
            axisPointer: {
              type: "cross",
              lineStyle: { color: "white" },
              crossStyle: { color: "white" },
            },
          }}
          xAxis={[
            {
              scaleType: "point",
              data: chartData.map((d) => d.time),
              tickLabelStyle: { fill: "white" },
              tickLineStyle: { stroke: "white" },
              axisLine: { style: { stroke: "white" } },
            },
          ]}
          yAxis={[
            {
              tickLabelStyle: { fill: "white" },
              tickLineStyle: { stroke: "white" },
              axisLine: { style: { stroke: "white" } },
              grid: true, // ✅ enable horizontal grid lines
            },
          ]}
          series={[
            {
              data: chartData.map((d) => d.temp),
              label: "Temperature (°C)",
              color: "white",
              showMark: true,
              area: false,
              curve: "linear",
              animationDuration: 1000,
              animationEasing: "ease-in-out",
            },
          ]}
          width={window.innerWidth * 0.8}
          height={400}
          sx={{
            backgroundColor: "transparent",
            ".MuiChartsAxis-root": {
              stroke: "white",
            },
            ".MuiChartsAxis-line": {
              stroke: "white",
            },
            ".MuiChartsTick-root": {
              stroke: "white",
            },
            ".MuiChartsAxis-tickLabel": {
              fill: "white",
            },
            ".MuiChartsGrid-line": {
              stroke: "rgba(255,255,255,0.2)",
            },
            ".MuiChartsLegend-root": {
              color: "white",
              fill: "white",
            },
            
            ".MuiChartsTooltip-table": {
              backgroundColor: "#132238 !important",
            },
            ".MuiChartsTooltip-cell": {
              color: "#132238",
            },
          }}
        />
        {/* Rotated Y-axis label with date */}
        <Typography
          variant="h6"
          sx={{
            color: "white",
            textAlign: "center",
            mr: 2,
          }}
        >
          Temperature Forecast of {chartData?.[0]?.date || date}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChartData;
