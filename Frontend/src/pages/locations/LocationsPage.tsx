import { useEffect, useState } from "react";

import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  Card,
  CardContent,
  MenuItem,
} from "@mui/material";

export default function LocationsPage() {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const [locationType, setLocationType] =
    useState("Warehouse");

  const [search, setSearch] = useState("");

  const [locations, setLocations] =
    useState<any[]>(() => {
      const stored = localStorage.getItem(
        "rfidflow-locations"
      );

      return stored ? JSON.parse(stored) : [];
    });

  useEffect(() => {
    localStorage.setItem(
      "rfidflow-locations",
      JSON.stringify(locations)
    );
  }, [locations]);

  const createLocation = () => {
    setLocations([
      ...locations,
      {
        id: crypto.randomUUID(),
        name,
        description,
        type: locationType,
        createdAt:
          new Date().toLocaleDateString(),
      },
    ]);

    setName("");
    setDescription("");
    setLocationType("Warehouse");

    setOpen(false);
  };

  const deleteLocation = (id: string) => {
    const confirmDelete = window.confirm(
      "¿Eliminar ubicación?"
    );

    if (!confirmDelete) return;

    setLocations(
      locations.filter(
        (location) => location.id !== id
      )
    );
  };

  const filteredLocations =
    locations.filter(
      (location) =>
        location.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        location.description
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const warehouseCount =
    locations.filter(
      (l) => l.type === "Warehouse"
    ).length;

  const productionCount =
    locations.filter(
      (l) => l.type === "Production"
    ).length;

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        Locations
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Total Locations
              </Typography>

              <Typography variant="h3">
                {locations.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Warehouses
              </Typography>

              <Typography variant="h3">
                {warehouseCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Production Areas
              </Typography>

              <Typography variant="h3">
                {productionCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => setOpen(true)}
      >
        Nueva Ubicación
      </Button>

      <TextField
        label="Buscar ubicación"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Creado</TableCell>
              <TableCell>Eliminar</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredLocations.map(
              (location) => (
                <TableRow
                  key={location.id}
                >
                  <TableCell>
                    {location.name}
                  </TableCell>

                  <TableCell>
                    {location.type}
                  </TableCell>

                  <TableCell>
                    {
                      location.description
                    }
                  </TableCell>

                  <TableCell>
                    {location.createdAt}
                  </TableCell>

                  <TableCell>
                    <Button
                      color="error"
                      onClick={() =>
                        deleteLocation(
                          location.id
                        )
                      }
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>
          Nueva Ubicación
        </DialogTitle>

        <DialogContent>
          <TextField
            margin="dense"
            label="Nombre"
            fullWidth
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <TextField
            margin="dense"
            label="Tipo"
            select
            fullWidth
            value={locationType}
            onChange={(e) =>
              setLocationType(
                e.target.value
              )
            }
          >
            <MenuItem value="Warehouse">
              Warehouse
            </MenuItem>

            <MenuItem value="Production">
              Production
            </MenuItem>

            <MenuItem value="Laboratory">
              Laboratory
            </MenuItem>

            <MenuItem value="Office">
              Office
            </MenuItem>
          </TextField>

          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setOpen(false)
            }
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={createLocation}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}