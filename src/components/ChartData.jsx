import React, { useState, useEffect } from "react";
import { Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

const ChartData = ({ chartData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [chartDimensions, setChartDimensions] = useState({
    width: 800,
    height: 400,
  });

  useEffect(() => {
    const updateDimensions = () => {
      const containerWidth = window.innerWidth;
      let width, height;

      if (isMobile) {
        width = Math.min(containerWidth * 0.95, 350);
        height = 250;
      } else if (isTablet) {
        width = Math.min(containerWidth * 0.9, 600);
        height = 300;
      } else {
        width = Math.min(containerWidth * 0.8, 800);
        height = 400;
      }

      setChartDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [isMobile, isTablet]);

  if (!chartData || chartData.length === 0) return null;

  const date = new Date().toISOString().slice(0, 10);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        mt: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2 }, // Responsive horizontal padding
      }}
    >
      {/* Chart container with colored background */}
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: "#3d495c",
          borderRadius: { xs: 3, sm: 2 },
          padding: { xs: 1, sm: 2 },
          overflow: "hidden", // Prevent chart overflow
          maxWidth: "100%",
        }}
      >
        <Box
          sx={{
            width: "100%",
            overflowX: isMobile ? "auto" : "visible", // Allow horizontal scroll on mobile if needed
            "&::-webkit-scrollbar": {
              height: 6,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(255,255,255,0.3)",
              borderRadius: 3,
            },
          }}
        >
          <LineChart
            grid={{
              horizontal: true,
              vertical: !isMobile, // Hide vertical grid on mobile for cleaner look
            }}
            tooltip={{
              show: true,
              showCrosshairs: !isMobile, // Disable crosshairs on mobile
              showContent: true,
              trigger: "axis",
              axisPointer: {
                type: isMobile ? "line" : "cross",
                lineStyle: { color: "white" },
                crossStyle: { color: "white" },
              },
            }}
            xAxis={[
              {
                scaleType: "point",
                data: chartData.map((d) => d.time),
                tickLabelStyle: {
                  fill: "white",
                  fontSize: isMobile ? 10 : 12, // Smaller font on mobile
                  angle: isMobile ? -45 : 0, // Rotate labels on mobile
                },
                tickLineStyle: { stroke: "white" },
                axisLine: { style: { stroke: "white" } },
                // Show fewer ticks on mobile to prevent crowding
                tickNumber: isMobile
                  ? Math.max(3, Math.floor(chartData.length / 3))
                  : undefined,
                tickMinStep: isMobile ? 2 : 1, // Skip every other tick on mobile
              },
            ]}
            yAxis={[
              {
                tickLabelStyle: {
                  fill: "white",
                  fontSize: isMobile ? 10 : 12, // Smaller font on mobile
                },
                tickLineStyle: { stroke: "white" },
                axisLine: { style: { stroke: "white" } },
                grid: true,
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
                animationDuration: isMobile ? 500 : 1000, // Faster animation on mobile
                animationEasing: "ease-in-out",
              },
            ]}
            width={chartDimensions.width}
            height={chartDimensions.height}
            margin={{
              left: isMobile ? 40 : 60,
              right: isMobile ? 20 : 40,
              top: isMobile ? 20 : 40,
              bottom: isMobile ? 60 : 80, // More bottom margin on mobile for rotated labels
            }}
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
                fontSize: isMobile ? "0.75rem" : "1rem",
              },
              ".MuiChartsTooltip-table": {
                backgroundColor: "#132238 !important",
              },
              ".MuiChartsTooltip-cell": {
                color: "white !important",
                fontSize: isMobile ? "0.75rem" : "0.875rem",
              },
              ".MuiChartsTooltip-root": {
                fontSize: isMobile ? "0.75rem" : "0.875rem",
              },
            }}
          />
        </Box>

        {/* Chart title with responsive typography */}
        <Typography
          variant={isMobile ? "body1" : "h6"}
          sx={{
            color: "white",
            textAlign: "center",
            mt: { xs: 1, sm: 2 },
            fontSize: {
              xs: "0.875rem",
              sm: "1rem",
              md: "1.25rem",
            },
            fontWeight: { xs: 500, sm: 400 },
            px: { xs: 1, sm: 0 }, // Padding on mobile to prevent text cutoff
          }}
        >
          Temperature Forecast of {chartData?.[0]?.date || date}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChartData;
