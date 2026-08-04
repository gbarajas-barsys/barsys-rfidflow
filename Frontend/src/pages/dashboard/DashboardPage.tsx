import { useEffect, useState } from "react";
import { api } from "../../api/apiClient";

import {
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

import RfidChart from "./components/RfidChart";
import WorkOrdersChart from "./components/WorkOrdersChart";
import LocationChart from "./components/LocationChart";
import AlertsPanel from "./components/AlertsPanel";
import OperationalHealth from "./components/OperationalHealth";

export default function DashboardPage() {
  const [itemsCount, setItemsCount] =
    useState(0);

  const [assetsCount, setAssetsCount] =
    useState(0);

  const [assignedTagsCount, setAssignedTagsCount] =
    useState(0);

  const [
    unassignedAssetsCount,
    setUnassignedAssetsCount,
  ] = useState(0);

  const [recentAssets, setRecentAssets] =
    useState<any[]>([]);

  const [assetsByLocation, setAssetsByLocation] =
    useState<Record<string, number>>({});

  const [assetsWithoutLocation, setAssetsWithoutLocation] =
    useState(0);

  const [workOrdersTotal, setWorkOrdersTotal] =
    useState(0);

  const [workOrdersOpen, setWorkOrdersOpen] =
    useState(0);

  const [workOrdersInProgress, setWorkOrdersInProgress] =
    useState(0);

  const [workOrdersClosed, setWorkOrdersClosed] =
    useState(0);

  const [rfidCoverage, setRfidCoverage] =
    useState(0);

  const [locationCoverage, setLocationCoverage] =
    useState(0);

  const [workOrderClosureRate, setWorkOrderClosureRate] =
    useState(0);

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
      localStorage.getItem(
        "rfidflow-assets"
      ) ?? "[]"
    );

    const assigned = assets.filter(
      (asset: any) => asset.epc
    ).length;

    setAssetsCount(assets.length);

    setAssignedTagsCount(assigned);

    setUnassignedAssetsCount(
      assets.length - assigned
    );

    setRecentAssets(
      [...assets]
        .reverse()
        .slice(0, 5)
    );

    const locationMap: Record<
      string,
      number
    > = {};

    let withoutLocation = 0;

    assets.forEach((asset: any) => {
      if (!asset.location) {
        withoutLocation++;
        return;
      }

      locationMap[asset.location] =
        (locationMap[
          asset.location
        ] || 0) + 1;
    });

    setAssetsByLocation(locationMap);

    setAssetsWithoutLocation(
      withoutLocation
    );

    const rfidPercent =
      assets.length === 0
        ? 0
        : Math.round(
            (assigned /
              assets.length) *
              100
          );

    setRfidCoverage(
      rfidPercent
    );

    const locatedAssets =
      assets.filter(
        (asset: any) =>
          asset.location
      ).length;

    const locationPercent =
      assets.length === 0
        ? 0
        : Math.round(
            (locatedAssets /
              assets.length) *
              100
          );

    setLocationCoverage(
      locationPercent
    );

    const workOrders = JSON.parse(
      localStorage.getItem(
        "rfidflow-workorders"
      ) ?? "[]"
    );

    setWorkOrdersTotal(
      workOrders.length
    );

    const open =
      workOrders.filter(
        (wo: any) =>
          wo.status ===
          "Abierta"
      ).length;

    const progress =
      workOrders.filter(
        (wo: any) =>
          wo.status ===
          "En Progreso"
      ).length;

    const closed =
      workOrders.filter(
        (wo: any) =>
          wo.status ===
          "Cerrada"
      ).length;

    setWorkOrdersOpen(open);

    setWorkOrdersInProgress(
      progress
    );

    setWorkOrdersClosed(
      closed
    );

    const closureRate =
      workOrders.length === 0
        ? 0
        : Math.round(
            (closed /
              workOrders.length) *
              100
          );

    setWorkOrderClosureRate(
      closureRate
    );
  }, []);

  const locationChartData = [
    ...Object.entries(
      assetsByLocation
    ).map(
      ([location, count]) => ({
        location,
        assets: count,
      })
    ),
    {
      location: "Sin ubicación",
      assets: assetsWithoutLocation,
    },
  ];

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
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
                Sin RFID
              </Typography>

              <Typography variant="h3">
                {
                  unassignedAssetsCount
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={3}
        sx={{ mt: 2 }}
      >
        <Grid item xs={12}>
          <OperationalHealth
            rfidCoverage={
              rfidCoverage
            }
            locationCoverage={
              locationCoverage
            }
            workOrderClosureRate={
              workOrderClosureRate
            }
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={3}
        sx={{ mt: 2 }}
      >
        <Grid item xs={12}>
          <AlertsPanel
            assetsWithoutRfid={
              unassignedAssetsCount
            }
            assetsWithoutLocation={
              assetsWithoutLocation
            }
            workOrdersOpen={
              workOrdersOpen
            }
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={3}
        sx={{ mt: 2 }}
      >
        <Grid item xs={12} md={6}>
          <RfidChart
            assignedTagsCount={
              assignedTagsCount
            }
            unassignedAssetsCount={
              unassignedAssetsCount
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <WorkOrdersChart
            workOrdersOpen={
              workOrdersOpen
            }
            workOrdersInProgress={
              workOrdersInProgress
            }
            workOrdersClosed={
              workOrdersClosed
            }
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={3}
        sx={{ mt: 2 }}
      >
        <Grid item xs={12}>
          <LocationChart
            locationChartData={
              locationChartData
            }
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={3}
        sx={{ mt: 2 }}
      >
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
            >
              KPIs Work Orders
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Typography>
              Total:
              {workOrdersTotal}
            </Typography>

            <Typography>
              Abiertas:
              {workOrdersOpen}
            </Typography>

            <Typography>
              En Progreso:
              {
                workOrdersInProgress
              }
            </Typography>

            <Typography>
              Cerradas:
              {
                workOrdersClosed
              }
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
            >
              Resumen de
              Ubicaciones
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <List>
              {Object.entries(
                assetsByLocation
              ).map(
                ([
                  location,
                  count,
                ]) => (
                  <ListItem
                    key={
                      location
                    }
                  >
                    <ListItemText
                      primary={
                        location
                      }
                      secondary={`${count} asset(s)`}
                    />
                  </ListItem>
                )
              )}

              <ListItemText
                  primary="Sin ubicación"
                  secondary={`${assetsWithoutLocation} asset(s)`}
                />
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
            >
              Actividad Reciente
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <List>
              {recentAssets.map(
                (asset) => (
                  <ListItem
                    key={asset.id}
                  >
                    <ListItemText
                      primary={
                        asset.name
                      }
                      secondary={
                        asset.epc
                          ? `RFID: ${asset.epc}`
                          : "RFID no asignado"
                      }
                    />
                  </ListItem>
                )
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}