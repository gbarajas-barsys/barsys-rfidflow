import { useEffect, useState } from "react";
import { api } from "../../api/apiClient";

import {
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

export default function RFIDPage() {
  const [tags, setTags] = useState<any[]>([]);
  const [readers, setReaders] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

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

    api
      .get("/v2/rfid/read-events?page=1&pageSize=100")
      .then((response) => {
        setEvents(response.data ?? []);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        RFID Center
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

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Read Events
              </Typography>

              <Typography variant="h3">
                {events.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>EPC</TableCell>
              <TableCell>Reader</TableCell>
              <TableCell>RSSI</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {events.map((event: any, index) => (
              <TableRow key={index}>
                <TableCell>{event.epc}</TableCell>
                <TableCell>{event.readerId}</TableCell>
                <TableCell>{event.rssi}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}