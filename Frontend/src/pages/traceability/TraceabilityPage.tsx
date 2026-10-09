import { useEffect, useState } from "react";

import { api } from "../../api/apiClient";

import {
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
  Paper
} from "@mui/material";

export default function TraceabilityPage() {

  const [
    data,
    setData
  ] = useState({
    total: 0,
    registered: 0,
    shipped: 0,
    returned: 0,
    tagged: 0
  });

  const [
    events,
    setEvents
    ] = useState<any[]>([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  useEffect(() => {

    loadDashboard();

  }, []);

  const loadDashboard =
  async () => {

    try {

      const [
        dashboardResponse,
        eventsResponse
      ] =
        await Promise.all([
          api.get(
            "/v2/traceability/dashboard"
          ),
          api.get(
            "/v2/traceability/recent-events"
          )
        ]);

      setData(
        dashboardResponse.data
      );

      setEvents(
        eventsResponse.data
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div style={{ padding: "2rem" }}>

      <Typography
        variant="h4"
        gutterBottom
      >
        Dashboard de Trazabilidad
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Indicadores RFID y ciclo de vida
        de unidades serializadas.
      </Typography>

      <Grid
        container
        spacing={3}
      >

        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>

              <Typography
                color="text.secondary"
              >
                Series Totales
              </Typography>

              <Typography
                variant="h3"
              >
                {data.total}
              </Typography>

            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>

              <Typography
                color="text.secondary"
              >
                Series Activas
              </Typography>

              <Typography
                variant="h3"
                color="success.main"
              >
                {data.registered}
              </Typography>

            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>

              <Typography
                color="text.secondary"
              >
                Embarcadas
              </Typography>

              <Typography
                variant="h3"
                color="warning.main"
              >
                {data.shipped}
              </Typography>

            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>

              <Typography
                color="text.secondary"
              >
                Retornadas
              </Typography>

              <Typography
                variant="h3"
                color="info.main"
              >
                {data.returned}
              </Typography>

            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>

              <Typography
                color="text.secondary"
              >
                Con EPC
              </Typography>

              <Typography
                variant="h3"
                color="secondary.main"
              >
                {data.tagged}
              </Typography>

            </CardContent>
          </Card>
        </Grid>

      </Grid>

      <Paper
        sx={{
            mt: 3,
            p: 3
        }}
        >
        <Typography
            variant="h6"
            gutterBottom
        >
            Último Evento RFID
        </Typography>

        {
            events.length > 0 && (
            <>
                <Typography
                variant="h5"
                color="primary"
                >
                {events[0].eventType}
                </Typography>

                <Typography>
                Serie:
                {" "}
                <strong>
                    {events[0].serialNumber}
                </strong>
                </Typography>

                <Typography>
                VIN:
                {" "}
                {events[0].vin}
                </Typography>

                <Typography>
                Fecha:
                {" "}
                {
                    new Date(
                    events[0].occurredAt
                    ).toLocaleString()
                }
                </Typography>

                <Typography>
                Comentarios:
                {" "}
                {events[0].comments}
                </Typography>
            </>
            )
        }
        </Paper>

      <Paper
        sx={{
            mt: 3,
            p: 3,
            maxHeight: 600,
            overflowY: "auto"
        }}
        >
        <Typography
            variant="h6"
            gutterBottom
        >
            Últimos Eventos RFID
        </Typography>

        <Table>

            <TableHead>
            <TableRow>
                <TableCell>
                Fecha
                </TableCell>

                <TableCell>
                Evento
                </TableCell>

                <TableCell>
                Serie
                </TableCell>

                <TableCell>
                VIN
                </TableCell>

                <TableCell>
                Comentarios
                </TableCell>
            </TableRow>
            </TableHead>

            <TableBody>

            {events.map(
                event => (

                <TableRow
                    key={event.id}
                >
                    <TableCell>
                    {
                        new Date(
                        event.occurredAt
                        ).toLocaleString()
                    }
                    </TableCell>

                    <TableCell>
                    {event.eventType}
                    </TableCell>

                    <TableCell>
                    {event.serialNumber}
                    </TableCell>

                    <TableCell>
                    {event.vin}
                    </TableCell>

                    <TableCell>
                    {event.comments}
                    </TableCell>

                </TableRow>

                )
            )}

            </TableBody>

        </Table>
        </Paper>

      {loading && (
        <Typography
          sx={{ mt: 2 }}
        >
          Cargando...
        </Typography>
      )}

    </div>
  );
}