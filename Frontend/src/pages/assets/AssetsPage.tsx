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
  Box,
  Chip,
  Alert,
} from "@mui/material";

export default function AssetsPage() {
  const [open, setOpen] = useState(false);

  const [assetNumber, setAssetNumber] = useState("");
  const [name, setName] = useState("");

  const [epc, setEpc] = useState("");

  const [encodingType, setEncodingType] =
    useState("GIAI");

  const [search, setSearch] = useState("");

  const [assets, setAssets] =
  useState<any[]>([]);

  const [locations] = useState<any[]>(() => {
    const stored =
      localStorage.getItem("rfidflow-locations");

    return stored ? JSON.parse(stored) : [];
  });

  const [detailAsset, setDetailAsset] =
    useState<any>(null);

  const [locationAsset, setLocationAsset] =
    useState<any>(null);

  const [timeline, setTimeline] =
    useState<any[]>([]);

  const [selectedLocation, setSelectedLocation] =
    useState("");

    useEffect(() => {

      loadAssets();

    }, []);

  const generateEpc =
  async () => {

    try {

      const response =
        await api.post(
          "/v2/rfid/epc/generate",
          {
            encoding:
              encodingType
          }
        );

      setEpc(
        response.data.epc
      );

    } catch (error) {

      console.error(error);

    }

  };

  const resetAssetForm = () => {

    setAssetNumber("");
    setName("");
    setEpc("");
    setEncodingType("GIAI");

  };

  const createAsset =
    async () => {

      try {

        const response =
          await api.post(
            "/v2/Assets",
            {
              assetNumber,
              name,
              description: "",
              serialNumber: ""
            }
          );

        const newAsset =
          response.data;

        if (epc) {

          await api.post(
            `/v2/Assets/${newAsset.id}/assign-tag`,
            {
              epc,
              tid: null,
              encodingType,
              overwriteExisting: false
            }
          );

        }

        await loadAssets();

        resetAssetForm();

        setOpen(false);

      } catch (error) {

        console.error(error);

        alert(
          "Error creando asset"
        );

      }

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

  const loadAssets = async () => {

    try {

      const response =
        await api.get(
          "/v2/Assets/all"
        );

      setAssets(
        response.data
      );

    } catch (error) {

      console.error(error);

    }

  };

  const loadTimeline = async (
    assetId: string
  ) => {

    try {

      const response =
        await api.get(
          `/v2/Assets/${assetId}/timeline`
        );

      setTimeline(
        response.data
      );

    } catch (error) {

      console.error(error);

    }

  };
  
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Activos
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Total de Activos
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
        onClick={() => {

          resetAssetForm();
          setOpen(true);

        }}
        sx={{ mb: 2 }}
      >
        Nuevo Activo
      </Button>

      <TextField
        label="Buscar Activo"
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
              <TableCell>Activo</TableCell>
              <TableCell>Estado RFID</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Detalles</TableCell>
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

                  <Chip
                    size="small"
                    color={
                      asset.epc
                        ? "success"
                        : "error"
                    }
                    label={
                      asset.epc
                        ? "RFID Asignado"
                        : "Sin RFID"
                    }
                  />

                </TableCell>


                <TableCell>
                  {asset.location ??
                    "Sin ubicación"}
                </TableCell>

                <TableCell>
                  <Button
                    size="small"
                    onClick={async () => {

                      setDetailAsset(asset);

                      await loadTimeline(
                        asset.id
                      );

                    }}
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

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="h6"
            gutterBottom
          >
            RFID
          </Typography>

          <TextField
            fullWidth
            margin="dense"
            label="EPC"
            value={epc}
            InputProps={{
              readOnly: true
            }}
          />

          <TextField
            select
            fullWidth
            margin="dense"
            label="Tipo de Codificación"
            value={encodingType}
            onChange={(e) =>
              setEncodingType(
                e.target.value
              )
            }
          >
            <MenuItem value="GIAI">
              GIAI
            </MenuItem>

            <MenuItem value="SGTIN">
              SGTIN
            </MenuItem>

            <MenuItem value="EPC_GEN2">
              EPC Gen2
            </MenuItem>

          </TextField>

          {epc && (
  <Alert
    severity="success"
    sx={{ mt: 2 }}
  >
    EPC generado correctamente
  </Alert>
)}

<Box
  sx={{
    display: "flex",
    justifyContent: "flex-end",
    mt: 2
  }}
>
  <Button
    variant="outlined"
    onClick={generateEpc}
    disabled={!!epc}
  >
    Generar EPC
  </Button>
</Box>

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() => {

              resetAssetForm();
              setOpen(false);

            }}
          >
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
    Activo 360°
  </DialogTitle>

  <Typography
    variant="subtitle2"
    color="text.secondary"
    sx={{
      display: "flex",
      gap: 1,
      mb: 1,
      mt: 1,
      ml: 11.5,
      flexWrap: "wrap"
    }}
  >
    Estado General
  </Typography>

  <Box
    sx={{
      display: "flex",
      gap: 1,
      mb: 2,
      mt: 1,
      ml: 2,
      flexWrap: "wrap"
    }}
  >
    <Chip
      color="success"
      label="Activo"
    />

    <Chip
      color={
        detailAsset?.epc
          ? "success"
          : "warning"
      }
      label={
        detailAsset?.epc
          ? "RFID Asignado"
          : "Pendiente RFID"
      }
    />

    <Chip
      color={
        detailAsset?.location
          ? "info"
          : "default"
      }
      label={
        detailAsset?.location
          ? detailAsset.location
          : "Sin Ubicación"
      }
    />
  </Box>

  <DialogContent>
    {detailAsset && (
      <>
        <Typography sx={{ mb: 1 }}>
          <strong>Nombre:</strong>{" "}
          {detailAsset.name}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Activo:</strong>{" "}
          {detailAsset.assetNumber}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>EPC RFID:</strong>{" "}
          {detailAsset.epc ??
            "Sin asignar"}
        </Typography>
             
        <Typography sx={{ mb: 1 }}>
          <strong>Ubicación:</strong>{" "}
          {detailAsset.location ??
            "Sin ubicación"}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Identificador:</strong>{" "}
          {detailAsset.id}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Tipo de activo:</strong>{" "}
          No definido
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Número de serie:</strong>{" "}
          No definido
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Fecha de alta:</strong>{" "}
          Próximamente
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="h6"
          gutterBottom
        >
          Identificación RFID
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{ mt: 2, mb: 2 }}
        >
          Timeline RFID
        </Typography>

        {
          timeline.length > 0
            ? (
              timeline.map(
                (event) => (
                  <Paper
                    key={
                      event.occurredAt +
                      event.eventType
                    }
                    sx={{
                      p: 2,
                      mb: 1,
                    }}
                  >
                    <Typography
                      fontWeight="bold"
                    >
                      {event.title}
                    </Typography>

                    <Typography
                      variant="body2"
                    >
                      {event.description}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {new Date(
                        event.occurredAt
                      ).toLocaleString()}
                    </Typography>
                  </Paper>
                )
              )
            )
            : (
              <Typography
                color="text.secondary"
              >
                Sin eventos RFID.
              </Typography>
            )
        }

        <Typography sx={{ mb: 1 }}>
          <strong>Estado RFID:</strong>{" "}
          {detailAsset.epc
            ? "Asignado"
            : "Pendiente"}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Última detección:</strong>{" "}
          No disponible
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Método de identificación:</strong>{" "}
          {detailAsset.epc
            ? "RFID"
            : "Sin RFID"}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="h6"
          gutterBottom
        >
          Estado Operativo
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Estado:</strong> Activo
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Disponibilidad:</strong> Disponible
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="h6"
          gutterBottom
        >
          Información de Ubicación
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Ubicación actual:</strong>{" "}
          {detailAsset.location ??
            "Sin ubicación"}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Última ubicación conocida:</strong>{" "}
          {detailAsset.location ??
            "Sin ubicación"}
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
            No existen órdenes de trabajo
            asociadas a este activo.
          </Typography>
        )}
      </>
    )}

    <Divider sx={{ my: 2 }} />

    <Typography
      variant="h6"
      gutterBottom
    >
      Actividad Reciente
    </Typography>

    <Typography
      color="text.secondary"
    >
      Sin actividad registrada.
    </Typography>
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