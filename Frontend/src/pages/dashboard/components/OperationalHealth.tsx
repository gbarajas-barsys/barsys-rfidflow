import {
  Paper,
  Typography,
  Divider,
  LinearProgress,
} from "@mui/material";

type Props = {
  rfidCoverage: number;
  locationCoverage: number;
  workOrderClosureRate: number;
};

export default function OperationalHealth({
  rfidCoverage,
  locationCoverage,
  workOrderClosureRate,
}: Props) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography
        variant="h6"
        gutterBottom
      >
        Operational Health
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Typography gutterBottom>
        RFID Coverage ({rfidCoverage}%)
      </Typography>

      <LinearProgress
        variant="determinate"
        value={rfidCoverage}
        sx={{
          height: 10,
          borderRadius: 5,
          mb: 3,
        }}
      />

      <Typography gutterBottom>
        Location Coverage ({locationCoverage}%)
      </Typography>

      <LinearProgress
        variant="determinate"
        value={locationCoverage}
        color="success"
        sx={{
          height: 10,
          borderRadius: 5,
          mb: 3,
        }}
      />

      <Typography gutterBottom>
        Work Order Closure Rate ({workOrderClosureRate}%)
      </Typography>

      <LinearProgress
        variant="determinate"
        value={workOrderClosureRate}
        color="warning"
        sx={{
          height: 10,
          borderRadius: 5,
        }}
      />
    </Paper>
  );
}