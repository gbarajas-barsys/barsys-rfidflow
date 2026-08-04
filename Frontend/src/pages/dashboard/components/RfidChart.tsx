import {
  Paper,
  Typography,
  Divider,
} from "@mui/material";

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";

type Props = {
  assignedTagsCount: number;
  unassignedAssetsCount: number;
};

export default function RfidChart({
  assignedTagsCount,
  unassignedAssetsCount,
}: Props) {
  const chartData = [
    {
      name: "RFID Asignados",
      value: assignedTagsCount,
    },
    {
      name: "Sin RFID",
      value: unassignedAssetsCount,
    },
  ];

  const COLORS = [
    "#4caf50",
    "#f44336",
  ];

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h6">
        Distribución RFID
      </Typography>

      <Divider
        sx={{
          mt: 1,
          mb: 2,
          width: "100%",
        }}
      />

      <PieChart
        width={420}
        height={300}
      >
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          dataKey="value"
          outerRadius={100}
          label
        >
          {chartData.map(
            (_, index) => (
              <Cell
                key={index}
                fill={
                  COLORS[
                    index %
                      COLORS.length
                  ]
                }
              />
            )
          )}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </Paper>
  );
}