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
  workOrdersOpen: number;
  workOrdersInProgress: number;
  workOrdersClosed: number;
};

export default function WorkOrdersChart({
  workOrdersOpen,
  workOrdersInProgress,
  workOrdersClosed,
}: Props) {
  const chartData = [
    {
      name: "Abiertas",
      value: workOrdersOpen,
    },
    {
      name: "En Progreso",
      value: workOrdersInProgress,
    },
    {
      name: "Cerradas",
      value: workOrdersClosed,
    },
  ];

  const COLORS = [
    "#f44336",
    "#ff9800",
    "#4caf50",
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
        Work Orders
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