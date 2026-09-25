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
  Box
} from "@mui/material";

export default function DashboardPage() {
  const [itemsCount, setItemsCount] =
    useState(0);

  const [locationsCount, setLocationsCount] =
    useState(0);

  const [workOrdersCount, setWorkOrdersCount] =
    useState(0);

  const [assetsWithoutRfid, setAssetsWithoutRfid] =
    useState(0);

  const [assetsWithoutLocation,
    setAssetsWithoutLocation] =
      useState(0);

  const [assetsCount, setAssetsCount] =
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

    api
      .get("/v2/Assets/all")
      .then((response) => {

        const assets =
          response.data;

        setAssetsCount(
          assets.length
        );

        setAssetsWithoutRfid(
          assets.filter(
            (x: any) => !x.epc
          ).length
        );

        setAssetsWithoutLocation(
          assets.filter(
            (x: any) =>
              !x.locationId
          ).length
        );

        setRecentAssets(
          assets
            .slice(-5)
            .reverse()
        );

      })
      .catch(console.error);

  }, []);

  useEffect(() => {

    api
      .get("/v2/Locations")
      .then((response) => {

        setLocationsCount(
          response.data.length
        );

      })
      .catch(console.error);

  }, []);

  useEffect(() => {

    api
      .get("/v2/work-orders")
      .then((response) => {

        setWorkOrdersCount(
          response.data.length
        );

      })
      .catch(console.error);

  }, []);

  
  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        Inicio
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        gutterBottom
      >
        Bienvenido a RFIDFlow 360
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        gutterBottom
      >
        Empresa:
        {" "}
        {
          localStorage.getItem(
            "selectedTenantName"
          ) ??
          "Barsys Demo Tenant"
        }
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 3,
              height: "100%"
            }}
          >
            <Typography>
              🟢 Backend Online
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 3,
              height: "100%"
            }}
          >
            <Typography>
              🏢 Empresa: 
              {" "}
              {
                localStorage.getItem(
                  "selectedTenantName"
                ) ??
                "Barsys Demo Tenant"
              }
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 3,
              height: "100%"
            }}
          >
            <Typography
              
            >
              📦 Plan: RFIDFlow 360
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              transition: "all .2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 6
              }
            }}
          >
            <CardContent
              sx={{
                py: 3
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <Typography variant="h6">
                  Productos
                </Typography>

                <Typography
                  sx={{
                    fontSize: 40
                  }}
                >
                  📦
                </Typography>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  mt: 2,
                  fontWeight: 700,
                  color: "#fff"
                }}
              >
                {itemsCount}
              </Typography>

            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              transition: "all .2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 6
              }
            }}
          >
            <CardContent
              sx={{
                py: 3
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <Typography variant="h6">
                  Activos
                </Typography>

                <Typography
                  sx={{
                    fontSize: 40
                  }}
                >
                  🖥️
                </Typography>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  mt: 2,
                  fontWeight: 700,
                  color: "#fff"
                }}
              >
                {assetsCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              transition: "all .2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 6
              }
            }}
          >
            <CardContent
              sx={{
                py: 3
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <Typography variant="h6">
                  Ubicaciones
                </Typography>

                <Typography
                  sx={{
                    fontSize: 40
                  }}
                >
                  📍
                </Typography>
              </Box>

              <Typography
                  variant="h3"
                  sx={{
                    mt: 2,
                    fontWeight: 700,
                    color: "#fff"
                  }}
                >
                {locationsCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              transition: "all .2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 6
              }
            }}
          >
            <CardContent
              sx={{
                py: 3
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <Typography variant="h6">
                  Órdenes de Trabajo
                </Typography>

                <Typography
                  sx={{
                    fontSize: 40
                  }}
                >
                  📋
                </Typography>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  mt: 2,
                  fontWeight: 700,
                  color: "#fff"
                }}
              >
                {workOrdersCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>

        <Typography
          variant="h6"
          gutterBottom
        >
          Atención Requerida
        </Typography>

        <Typography>
          ⚠ Activos sin RFID: {assetsWithoutRfid}
        </Typography>

        <Typography>
          ⚠ Activos sin ubicación: {assetsWithoutLocation}
        </Typography>

      </Paper>

      <Grid
        container
        spacing={3}
        sx={{ mt: 2 }}
      >
        
        <Grid item xs={12}>
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