import { Card, CardContent, Grid, Typography } from "@mui/material";

export default function DashboardPage() {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        RFIDFlow Dashboard
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Assets
              </Typography>

              <Typography variant="h3">
                0
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                RFID Tags
              </Typography>

              <Typography variant="h3">
                0
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Inventory
              </Typography>

              <Typography variant="h3">
                0
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
                0
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}