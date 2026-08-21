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

import {
  getLocations,
  createLocation as createLocationApi,
  updateLocation as updateLocationApi,
  deleteLocation as deleteLocationApi,
} from "../../services/locationService";

export default function LocationsPage() {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const [locationType, setLocationType] =
    useState("Warehouse");

  const [search, setSearch] = useState("");

  const [locations, setLocations] =
  useState<any[]>([]);

  const [editingLocation, setEditingLocation] =
  useState<any | null>(null);

  useEffect(() => {
  loadLocations();
}, []);

const loadLocations = async () => {
  try {
    const data = await getLocations();

    console.log(
      "Locations:",
      data
    );

    setLocations(data);
  } catch (error) {
    console.error(
      "Error loading locations",
      error
    );
  }
};

  const createLocationLocal = () => {
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

  const updateLocation = async () => {
  if (!editingLocation) return;

  try {
    await updateLocationApi(
      editingLocation.id,
      {
        id: editingLocation.id,
        organizationId:
          editingLocation.organizationId,

        code: editingLocation.code,

        name,

        type:
          locationType === "Warehouse"
            ? 1
            : 2,

        latitude:
          editingLocation.latitude ?? 0,

        longitude:
          editingLocation.longitude ?? 0,

        active: true,
      }
    );

    setOpen(false);

    setEditingLocation(null);

    await loadLocations();
  } catch (error) {
    console.error(
      "Error updating location",
      error
    );
  }
};

  const createLocation = async () => {
  try {
    await createLocationApi({
  organizationId:
    "7c344491-6d37-413e-946a-7313442dad61",

  code: name
    .toUpperCase()
    .replaceAll(" ", "-"),

  name,
  type: 1,
  latitude: 0,
  longitude: 0,
  active: true,
});

    setName("");
    setDescription("");
    setLocationType("Warehouse");

    setOpen(false);

    await loadLocations();
  } catch (error) {
    console.error(
      "Error creating location",
      error
    );
  }
};

  const deleteLocation = async (
  id: string
) => {
  const confirmDelete = window.confirm(
    "¿Eliminar ubicación?"
  );

  if (!confirmDelete) return;

  try {
    await deleteLocationApi(id);

    await loadLocations();
  } catch (error) {
    console.error(
      "Error deleting location",
      error
    );
  }
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
              <TableCell>Código</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Actualizado</TableCell>
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
                    {location.code}
                  </TableCell>

                  <TableCell>
                    {location.type === 1
                      ? "Warehouse"
                      : location.type}
                  </TableCell>

                  <TableCell>
                    {location.updatedAt}
                  </TableCell>

                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => {
                        setEditingLocation(location);

                        setName(location.name);

                        setLocationType(
                          location.type === 1
                            ? "Warehouse"
                            : "Production"
                        );

                        setOpen(true);
                      }}
                    >
                      Editar
                    </Button>

                    <Button
                      color="error"
                      onClick={() =>
                        deleteLocation(location.id)
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
          {editingLocation
            ? "Editar Ubicación"
            : "Nueva Ubicación"}
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
            onClick={
              editingLocation
                ? updateLocation
                : createLocation
            }
          >
            {editingLocation
              ? "Actualizar"
              : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}