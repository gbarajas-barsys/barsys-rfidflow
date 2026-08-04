import {
  Typography,
  Grid,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function ReportsPage() {
  const assets = JSON.parse(
    localStorage.getItem("rfidflow-assets") ?? "[]"
  );

  const locations = JSON.parse(
    localStorage.getItem("rfidflow-locations") ?? "[]"
  );

  const workOrders = JSON.parse(
    localStorage.getItem("rfidflow-workorders") ?? "[]"
  );

  const assetIncidentMap: Record<string, number> =
    {};

  workOrders.forEach((wo: any) => {
    if (!wo.asset) return;

    assetIncidentMap[wo.asset] =
      (assetIncidentMap[wo.asset] || 0) + 1;
  });

  const assetsWithIncidents =
    Object.entries(assetIncidentMap)
      .sort((a, b) => b[1] - a[1]);

  const locationMap: Record<string, number> =
    {};

  assets.forEach((asset: any) => {
    if (!asset.location) return;

    locationMap[asset.location] =
      (locationMap[asset.location] || 0) + 1;
  });

  const locationsWithAssets =
    Object.entries(locationMap)
      .sort((a, b) => b[1] - a[1]);

  const assetsWithoutRfid =
    assets.filter(
      (asset: any) => !asset.epc
    );

  const assetsWithoutLocation =
    assets.filter(
      (asset: any) => !asset.location
    );

  const locationChartData =
    locationsWithAssets.map(
      ([location, count]) => ({
        location,
        assets: count,
      })
    );

  const incidentsChartData =
    assetsWithIncidents.map(
      ([asset, count]) => ({
        asset,
        workOrders: count,
      })
    );

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        Reports
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Assets
              </Typography>

              <Typography variant="h3">
                {assets.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Locations
              </Typography>

              <Typography variant="h3">
                {locations.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Work Orders
              </Typography>

              <Typography variant="h3">
                {workOrders.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Assets RFID
              </Typography>

              <Typography variant="h3">
                {
                  assets.filter(
                    (a: any) => a.epc
                  ).length
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={3}
      >
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
            >
              Ubicaciones con más Assets
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
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
            >
              Assets con más Incidencias
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <BarChart
              width={900}
              height={300}
              data={incidentsChartData}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="asset" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="workOrders"
                fill="#ff9800"
              />
            </BarChart>
          </Paper>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
        >
          <Paper sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
            >
              Assets sin RFID
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <List>
              {assetsWithoutRfid.map(
                (asset: any) => (
                  <ListItem
                    key={asset.id}
                  >
                    <ListItemText
                      primary={
                        asset.name
                      }
                      secondary={
                        asset.assetNumber
                      }
                    />
                  </ListItem>
                )
              )}

              {assetsWithoutRfid.length ===
                0 && (
                <ListItemText
                    primary="Todos los Assets tienen RFID"
                  />
              )}
            </List>
          </Paper>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
        >
          <Paper sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
            >
              Assets sin Ubicación
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <List>
              {assetsWithoutLocation.map(
                (asset: any) => (
                  <ListItem
                    key={asset.id}
                  >
                    <ListItemText
                      primary={
                        asset.name
                      }
                      secondary={
                        asset.assetNumber
                      }
                    />
                  </ListItem>
                )
              )}

              {assetsWithoutLocation.length ===
                0 && (
                <ListItemText
                    primary="Todos los Assets tienen ubicación"
                  />
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}