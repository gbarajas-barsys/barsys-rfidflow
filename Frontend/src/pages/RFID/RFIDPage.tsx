import { useEffect, useState } from "react";
import { api } from "../../api/apiClient";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  Grid,
  Typography,
  } from "@mui/material";

export default function RFIDPage() {
  const navigate = useNavigate();
  const [tags, setTags] = useState<any[]>([]);
  const [readers, setReaders] = useState<any[]>([]);
  
  useEffect(() => {
    api
      .get("/v2/rfid/tags?page=1&pageSize=100")
      .then((response) => {
        setTags(response.data ?? []);
      })
      .catch(console.error);

    api
      .get("/v2/rfid/readers?page=1&pageSize=100")
      .then((response) => {
        setReaders(response.data ?? []);
      })
      .catch(console.error);

    }, []);

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        RFID Operations
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                RFID Tags
              </Typography>

              <Typography variant="h3">
                {tags.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Readers
              </Typography>

              <Typography variant="h3">
                {readers.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Typography
        variant="h5"
        sx={{ mb: 2 }}
      >
        RFID Applications
      </Typography>

      <Grid
        container
        spacing={3}
      >
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Production Tracking
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Track production flow using
                RFID events.
              </Typography>

              <Button
                variant="contained"
                onClick={() =>
                  navigate(
                    "/production-tracking"
                  )
                }
              >
                Open
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Facility Map
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Visualize RFID zones and
                antenna coverage.
              </Typography>

              <Button
                variant="contained"
                onClick={() =>
                  navigate(
                    "/rfid-facility-map"
                  )
                }
              >
                Open
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Asset Tracking
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Track asset movement across
                RFID areas.
              </Typography>

              <Button
                variant="contained"
              >
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Tag Search
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Search tags by EPC,
                location or antenna.
              </Typography>

              <Button
                variant="contained"
              >
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
    </>
  );
}