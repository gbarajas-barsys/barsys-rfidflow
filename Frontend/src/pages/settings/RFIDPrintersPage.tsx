import { useEffect, useState } from "react";
import { api } from "../../api/apiClient";

import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";

export default function RFIDPrintersPage() {

  const [printers, setPrinters] =
    useState<any[]>([]);

  const loadPrinters =
    async () => {

      try {

        const response =
          await api.get(
            "/v2/rfid/printers"
          );

        setPrinters(
          response.data
        );

      } catch (error) {

        console.error(error);

      }

    };

  useEffect(() => {

    loadPrinters();

  }, []);

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">
          Impresoras RFID
        </Typography>

        <Button
          variant="contained"
          color="primary"
        >
          Nueva Impresora
        </Button>
      </Box>

      <Paper
        sx={{
          mb: 2,
          py: 3
        }}
      >
        <Typography
          variant="h5"
          textAlign="center"
          fontWeight={600}
        >
          Administración de Impresoras RFID
        </Typography>

        <Typography
          color="text.secondary"
          textAlign="center"
          sx={{ mt: 1 }}
        >
          Configure impresoras Zebra,
          puertos, IPs y estado operativo.
        </Typography>
      </Paper>

      <Paper>

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>
                Nombre
              </TableCell>

              <TableCell>
                Modelo
              </TableCell>

              <TableCell>
                Dirección IP
              </TableCell>

              <TableCell>
                Puerto
              </TableCell>

              <TableCell>
                Estado
              </TableCell>

              <TableCell>
                Predeterminada
              </TableCell>

              <TableCell>
                Acciones
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {printers.map(
              printer => (

                <TableRow
                  key={printer.id}
                >

                  <TableCell>
                    {printer.name}
                  </TableCell>

                  <TableCell>
                    {printer.model}
                  </TableCell>

                  <TableCell>
                    {printer.ipAddress}
                  </TableCell>

                  <TableCell>
                    {printer.port}
                  </TableCell>

                  <TableCell>

                    <Chip
                      size="small"
                      color={
                        printer.isEnabled
                          ? "success"
                          : "error"
                      }
                      label={
                        printer.isEnabled
                          ? "Activa"
                          : "Inactiva"
                      }
                    />

                  </TableCell>

                  <TableCell>

                    {
                      printer.isDefault &&
                      (
                        <Chip
                          size="small"
                          color="primary"
                          label="Default"
                        />
                      )
                    }

                  </TableCell>

                  <TableCell>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1
                      }}
                    >

                      <Button
                        size="small"
                        variant="outlined"
                      >
                        Editar
                      </Button>

                      <Button
                        size="small"
                        color={
                          printer.isEnabled
                            ? "error"
                            : "success"
                        }
                        variant="outlined"
                      >
                        {
                          printer.isEnabled
                            ? "Desactivar"
                            : "Activar"
                        }
                      </Button>

                    </Box>

                  </TableCell>

                </TableRow>

              )
            )}

          </TableBody>

        </Table>

      </Paper>
    </>
  );

}