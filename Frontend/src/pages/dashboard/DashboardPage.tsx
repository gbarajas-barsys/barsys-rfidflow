import { useEffect, useState } from "react";
import { api } from "../../api/apiClient";

import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export default function DashboardPage() {
  const [itemsCount, setItemsCount] = useState(0);

  const [assetsCount, setAssetsCount] = useState(0);

  const [assignedTagsCount, setAssignedTagsCount] =
    useState(0);

  const [recentAssets, setRecentAssets] =
    useState<any[]>([]);

  useEffect(() => {
    api
      .get("/v2/Items?page=1&pageSize=100")
      .then((response) => {
        setItemsCount(response.data.length);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const assets = JSON.parse(
      localStorage.getItem("rfidflow-assets") ?? "[]"
    );

    setAssetsCount(assets.length);

    setAssignedTagsCount(
      assets.filter(
        (asset: any) =>
          asset.epc &&
          asset.epc !== "Sin asignar"
      ).length
    );

    setRecentAssets(
      [...assets].reverse().slice(0, 5)
    );
  }, []);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Inventario
              </Typography>

              <Typography variant="h3">
                {itemsCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Assets
              </Typography>

              <Typography variant="h3">
                {assetsCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                RFID Asignados
              </Typography>

              <Typography variant="h3">
                {assignedTagsCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Lecturas RFID
              </Typography>

              <Typography variant="h3">
                0
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Paper sx={{ p: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
          >
            Actividad Reciente
          </Typography>

          <List>
            {recentAssets.map((asset) => (
              <ListItem key={asset.id}>
                <ListItemText
                  primary={asset.name}
                  secondary={
                    asset.epc ??
                    "RFID no asignado"
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      <Box mt={4}>
        <Typography variant="h6">
          Estado del Sistema
        </Typography>

        <Typography>
          Backend operativo ✅
        </Typography>

        <Typography>
          PostgreSQL operativo ✅
        </Typography>

        <Typography>
          RFIDFlow activo ✅
        </Typography>
      </Box>
    </>
  );
}