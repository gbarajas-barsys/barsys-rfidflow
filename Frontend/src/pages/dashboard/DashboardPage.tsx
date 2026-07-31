import { useEffect, useState } from "react";
import { api } from "../../api/apiClient";

import {
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

export default function DashboardPage() {
  const [itemsCount, setItemsCount] = useState(0);

  useEffect(() => {
    api
      .get("/v2/Items?page=1&pageSize=100")
      .then((response) => {
        setItemsCount(response.data.length);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
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

        <Grid item xs={12} md={4}>
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

        <Grid item xs={12} md={4}>
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