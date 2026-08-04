import {
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Button,
  Divider,
  FormControlLabel,
  Switch,
} from "@mui/material";

export default function SettingsPage() {
  const assets = JSON.parse(
    localStorage.getItem(
      "rfidflow-assets"
    ) ?? "[]"
  );

  const locations = JSON.parse(
    localStorage.getItem(
      "rfidflow-locations"
    ) ?? "[]"
  );

  const workOrders = JSON.parse(
    localStorage.getItem(
      "rfidflow-workorders"
    ) ?? "[]"
  );

  const savedTheme =
    localStorage.getItem(
      "rfidflow-theme"
    ) ?? "dark";

  const exportAssetsCsv = () => {
    const csv = [
      "Asset,RFID,Location",
      ...assets.map(
        (asset: any) =>
          `${asset.name},${asset.epc ?? ""},${asset.location ?? ""}`
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url =
      window.URL.createObjectURL(
        blob
      );

    const a =
      document.createElement("a");

    a.href = url;
    a.download = "assets.csv";
    a.click();
  };

  const exportWorkOrdersCsv =
    () => {
      const csv = [
        "Title,Asset,Status",
        ...workOrders.map(
          (wo: any) =>
            `${wo.title},${wo.asset ?? ""},${wo.status}`
        ),
      ].join("\n");

      const blob = new Blob(
        [csv],
        {
          type: "text/csv",
        }
      );

      const url =
        window.URL.createObjectURL(
          blob
        );

      const a =
        document.createElement("a");

      a.href = url;
      a.download =
        "workorders.csv";

      a.click();
    };

  const clearDemoData = () => {
    const confirmed =
      window.confirm(
        "¿Eliminar todos los datos locales?"
      );

    if (!confirmed) return;

    localStorage.removeItem(
      "rfidflow-assets"
    );

    localStorage.removeItem(
      "rfidflow-locations"
    );

    localStorage.removeItem(
      "rfidflow-workorders"
    );

    alert(
      "Datos eliminados. Recarga la página."
    );
  };

  const changeTheme = (
    checked: boolean
  ) => {
    localStorage.setItem(
      "rfidflow-theme",
      checked
        ? "light"
        : "dark"
    );

    window.location.reload();
  };

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        Settings
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
                Versión
              </Typography>

              <Typography variant="h3">
                1.0
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper
        sx={{
          p: 3,
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
        >
          Tema
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <FormControlLabel
          control={
            <Switch
              checked={
                savedTheme ===
                "light"
              }
              onChange={(e) =>
                changeTheme(
                  e.target.checked
                )
              }
            />
          }
          label="Modo Claro"
        />
      </Paper>

      <Paper
        sx={{
          p: 3,
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
        >
          Sistema
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography>
          ✅ RFIDFlow Platform
        </Typography>

        <Typography>
          ✅ Frontend Online
        </Typography>

        <Typography>
          ✅ LocalStorage Activo
        </Typography>

        <Typography>
          ✅ Datos Persistentes
        </Typography>
      </Paper>

      <Paper
        sx={{
          p: 3,
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
        >
          Exportación
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Button
          variant="contained"
          sx={{ mr: 2 }}
          onClick={
            exportAssetsCsv
          }
        >
          Exportar Assets CSV
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={
            exportWorkOrdersCsv
          }
        >
          Exportar Work Orders CSV
        </Button>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
        >
          Administración
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Button
          color="error"
          variant="contained"
          onClick={clearDemoData}
        >
          Limpiar Datos Locales
        </Button>
      </Paper>
    </>
  );
}