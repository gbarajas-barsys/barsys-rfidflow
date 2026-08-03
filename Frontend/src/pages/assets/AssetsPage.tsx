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
} from "@mui/material";

export default function AssetsPage() {
  const [open, setOpen] = useState(false);

  const [assetNumber, setAssetNumber] = useState("");
  const [name, setName] = useState("");

  const [assets, setAssets] = useState<any[]>(() => {
    const stored = localStorage.getItem(
      "rfidflow-assets"
    );

    return stored ? JSON.parse(stored) : [];
  });

  const [selectedAsset, setSelectedAsset] =
    useState<any>(null);

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

  const assignRfid = async () => {
    try {
      const response = await api.post(
        `/v2/Assets/${selectedAsset.id}/assign-tag`,
        {
          epc,
          tid: "WEB-CLIENT",
          overwriteExisting: false,
        }
      );

      setAssets(
        assets.map((asset) =>
          asset.id === selectedAsset.id
            ? response.data
            : asset
        )
      );

      setEpc("");
      setSelectedAsset(null);
    } catch (error) {
      console.error(error);
      alert("Error asignando RFID");
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Assets
      </Typography>

      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        Nuevo Asset
      </Button>

      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Activo</TableCell>
              <TableCell>Número</TableCell>
              <TableCell>RFID</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>
                  {asset.name}
                </TableCell>

                <TableCell>
                  {asset.assetNumber}
                </TableCell>

                <TableCell>
                  {asset.epc ?? "Sin asignar"}
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

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
          <Button
            onClick={() => setOpen(false)}
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
    </>
  );
}