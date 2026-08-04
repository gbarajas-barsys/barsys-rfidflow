import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

type Props = {
  open: boolean;
  epc: string;
  name: string;
  assetNumber: string;
  location: string;

  onNameChange: (
    value: string
  ) => void;

  onAssetNumberChange: (
    value: string
  ) => void;

  onLocationChange: (
    value: string
  ) => void;

  onClose: () => void;

  onSave: () => void;
};

export default function QuickAssetRegistrationDialog({
  open,
  epc,
  name,
  assetNumber,
  location,
  onNameChange,
  onAssetNumberChange,
  onLocationChange,
  onClose,
  onSave,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Registrar Asset RFID
      </DialogTitle>

      <DialogContent>
        <TextField
          label="Nombre"
          fullWidth
          margin="dense"
          value={name}
          onChange={(e) =>
            onNameChange(
              e.target.value
            )
          }
        />

        <TextField
          label="Número de Asset"
          fullWidth
          margin="dense"
          value={assetNumber}
          onChange={(e) =>
            onAssetNumberChange(
              e.target.value
            )
          }
        />

        <TextField
          label="Ubicación"
          fullWidth
          margin="dense"
          value={location}
          onChange={(e) =>
            onLocationChange(
              e.target.value
            )
          }
        />

        <TextField
          label="EPC"
          fullWidth
          margin="dense"
          value={epc}
          disabled
        />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={onSave}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}