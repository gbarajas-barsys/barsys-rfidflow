import {
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

type Props = {
  assets: {
    name: string;
    incidents: number;
  }[];
};

export default function TopAssetsPanel({
  assets,
}: Props) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
      >
        Top Assets por Incidencias
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <List>
        {assets.length === 0 && (
          <ListItemText
              primary="Sin incidencias registradas"
            />
        )}

        {assets.map((asset) => (
          <ListItem
            key={asset.name}
          >
            <ListItemText
              primary={asset.name}
              secondary={`${asset.incidents} Work Order(s)`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}