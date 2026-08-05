import { useEffect, useState } from "react";
import { api } from "../../api/apiClient";

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
  Divider,
} from "@mui/material";

export default function AssetsPage() {
  const [open, setOpen] = useState(false);

  const [assetNumber, setAssetNumber] = useState("");
  const [name, setName] = useState("");

  const [search, setSearch] = useState("");

  const [assets, setAssets] = useState<any[]>(() => {
    const stored =
      localStorage.getItem("rfidflow-assets");

    return stored ? JSON.parse(stored) : [];
  });

  const [locations] = useState<any[]>(() => {
    const stored =
      localStorage.getItem("rfidflow-locations");

    return stored ? JSON.parse(stored) : [];
  });

  const [selectedAsset, setSelectedAsset] =
    useState<any>(null);

  const [detailAsset, setDetailAsset] =
    useState<any>(null);

  const [locationAsset, setLocationAsset] =
    useState<any>(null);

  const [selectedLocation, setSelectedLocation] =
    useState("");

  const [epc, setEpc] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "rfidflow-assets",
      JSON.stringify(assets)
    );
  }, [assets]);

  const createAsset = async () => {
    try {
      const response = await api.post(
        "/v2/Assets",
        {
          assetNumber,
          name,
          description: "",
          serialNumber: "",
        }
      );

      setAssets((previous) => [
        ...previous,
        {
          ...response.data,
          epc: response.data.epc,
          location: null,
        },
      ]);

      setAssetNumber("");
      setName("");

      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error creando asset");
    }
  };

  const assignRfid = () => {
  setAssets(
    assets.map((asset) =>
      asset.id === selectedAsset.id
        ? {
            ...asset,
            epc,
          }
        : asset
    )
  );

  setEpc("");
  setSelectedAsset(null);
};

  const assignLocation = () => {
    setAssets(
      assets.map((asset) =>
        asset.id === locationAsset.id
          ? {
              ...asset,
              location: selectedLocation,
            }
          : asset
      )
    );

    setLocationAsset(null);
    setSelectedLocation("");
  };

  const deleteAsset = (assetId: string) => {
    const confirmDelete = window.confirm(
      "¿Eliminar este Asset?"
    );

    if (!confirmDelete) return;

    setAssets(
      assets.filter(
        (asset) => asset.id !== assetId
      )
    );
  };

  const filteredAssets = assets.filter(
    (asset) =>
      asset.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      asset.assetNumber
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  const totalAssets = assets.length;

  const assignedAssets = assets.filter(
    (asset) => asset.epc
  ).length;

  const unassignedAssets =
    totalAssets - assignedAssets;

  const assetsWithoutLocation =
    assets.filter(
      (asset) => !asset.location
    ).length;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Assets
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Total Assets
              </Typography>

              <Typography variant="h3">
                {totalAssets}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                RFID Asignados
              </Typography>

              <Typography variant="h3">
                {assignedAssets}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Sin RFID
              </Typography>

              <Typography variant="h3">
                {unassignedAssets}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Sin Ubicación
              </Typography>

              <Typography variant="h3">
                {assetsWithoutLocation}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        Nuevo Asset
      </Button>

      <TextField
        label="Buscar Asset"
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
              <TableCell>Activo</TableCell>
              <TableCell>Número</TableCell>
              <TableCell>RFID</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>RFID</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Ver</TableCell>
              <TableCell>Eliminar</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredAssets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>{asset.name}</TableCell>

                <TableCell>
                  {asset.assetNumber}
                </TableCell>

                <TableCell>
                  {asset.epc
                    ? "🟢 Asignado"
                    : "🔴 Sin RFID"}
                </TableCell>

                <TableCell>
                  {asset.location ??
                    "Sin ubicación"}
                </TableCell>

                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                      setSelectedAsset(asset)
                    }
                  >
                    RFID
                  </Button>
                </TableCell>

                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                      setLocationAsset(asset)
                    }
                  >
                    Location
                  </Button>
                </TableCell>

                <TableCell>
                  <Button
                    size="small"
                    onClick={() =>
                      setDetailAsset(asset)
                    }
                  >
                    Ver
                  </Button>
                </TableCell>

                <TableCell>
                  <Button
                    size="small"
                    color="error"
                    onClick={() =>
                      deleteAsset(asset.id)
                    }
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Nuevo Asset */}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>
          Nuevo Asset
        </DialogTitle>

        <DialogContent>
          <TextField
            margin="dense"
            label="Número"
            fullWidth
            value={assetNumber}
            onChange={(e) =>
              setAssetNumber(e.target.value)
            }
          />

          <TextField
            margin="dense"
            label="Nombre"
            fullWidth
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={createAsset}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* RFID */}

      <Dialog
        open={selectedAsset !== null}
        onClose={() =>
          setSelectedAsset(null)
        }
      >
        <DialogTitle>
          Asignar RFID
        </DialogTitle>

        <DialogContent>
          <TextField
            margin="dense"
            label="EPC RFID"
            fullWidth
            value={epc}
            onChange={(e) =>
              setEpc(e.target.value)
            }
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setSelectedAsset(null)
            }
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={assignRfid}
          >
            Asignar
          </Button>
        </DialogActions>
      </Dialog>

      {/* LOCATION */}

      <Dialog
        open={locationAsset !== null}
        onClose={() =>
          setLocationAsset(null)
        }
      >
        <DialogTitle>
          Asignar Ubicación
        </DialogTitle>

        <DialogContent>
          <TextField
            select
            fullWidth
            margin="dense"
            label="Ubicación"
            value={selectedLocation}
            onChange={(e) =>
              setSelectedLocation(
                e.target.value
              )
            }
          >
            {locations.map((location) => (
              <MenuItem
                key={location.id}
                value={location.name}
              >
                {location.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setLocationAsset(null)
            }
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={assignLocation}
          >
            Asignar
          </Button>
        </DialogActions>
      </Dialog>

      {/* DETALLE */}

<Dialog
  open={detailAsset !== null}
  onClose={() =>
    setDetailAsset(null)
  }
  maxWidth="md"
  fullWidth
>
  <DialogTitle>
    Asset 360°
  </DialogTitle>

  <DialogContent>
    {detailAsset && (
      <>
        <Typography sx={{ mb: 1 }}>
          <strong>Nombre:</strong>{" "}
          {detailAsset.name}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Número:</strong>{" "}
          {detailAsset.assetNumber}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>RFID:</strong>{" "}
          {detailAsset.epc ??
            "Sin asignar"}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Ubicación:</strong>{" "}
          {detailAsset.location ??
            "Sin ubicación"}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>ID:</strong>{" "}
          {detailAsset.id}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="h6"
          gutterBottom
        >
          Work Orders Asociadas
        </Typography>

        {JSON.parse(
          localStorage.getItem(
            "rfidflow-workorders"
          ) ?? "[]"
        )
          .filter(
            (wo: any) =>
              wo.asset ===
              detailAsset.name
          )
          .map((wo: any) => (
            <Paper
              key={wo.id}
              sx={{
                p: 2,
                mb: 2,
              }}
            >
              <Typography>
                <strong>
                  {wo.title}
                </strong>
              </Typography>

              <Typography>
                {wo.description}
              </Typography>

              <Typography>
                Estado: {wo.status}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Fecha: {wo.createdAt}
              </Typography>
            </Paper>
          ))}

        {JSON.parse(
          localStorage.getItem(
            "rfidflow-workorders"
          ) ?? "[]"
        ).filter(
          (wo: any) =>
            wo.asset ===
            detailAsset.name
        ).length === 0 && (
          <Typography>
            No existen Work Orders
            asociadas a este Asset.
          </Typography>
        )}
      </>
    )}
  </DialogContent>

  <DialogActions>
    <Button
      onClick={() =>
        setDetailAsset(null)
      }
    >
      Cerrar
    </Button>
  </DialogActions>
</Dialog>
    </>
  );
}