import {
  Paper,
  Typography,
  Divider,
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type Props = {
  locationChartData: {
    location: string;
    assets: number;
  }[];
};

export default function LocationChart({
  locationChartData,
}: Props) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
      >
        Assets por Ubicación
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <BarChart
        width={900}
        height={300}
        data={locationChartData}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="location" />

        <YAxis />

        <Tooltip />

        <Bar
          dataKey="assets"
          fill="#1976d2"
        />
      </BarChart>
    </Paper>
  );
}