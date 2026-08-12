import {
  Paper,
  Typography,
  Divider,
  List,
  ListItemText,
} from "@mui/material";

type Props = {
  assetsWithoutRfid: number;
  assetsWithoutLocation: number;
  workOrdersOpen: number;
};

export default function AlertsPanel({
  assetsWithoutRfid,
  assetsWithoutLocation,
  workOrdersOpen,
}: Props) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
      >
        Operational Alerts
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <List>
        {assetsWithoutRfid > 0 && (
          <ListItemText
              primary={`⚠ ${assetsWithoutRfid} Assets sin RFID`}
            />
        )}

        {assetsWithoutLocation > 0 && (
          <ListItemText
              primary={`⚠ ${assetsWithoutLocation} Assets sin Ubicación`}
            />
        )}

        {workOrdersOpen > 0 && (
          <ListItemText
              primary={`⚠ ${workOrdersOpen} Work Orders Abiertas`}
            />
        )}

        {assetsWithoutRfid === 0 &&
          assetsWithoutLocation === 0 &&
          workOrdersOpen === 0 && (
            <ListItemText
                primary="✅ Sin alertas operativas"
              />
          )}
      </List>
    </Paper>
  );
}