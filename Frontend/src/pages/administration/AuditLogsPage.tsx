import { useEffect, useState } from "react";
import { Chip } from "@mui/material";
import { api } from "../../api/apiClient";
import SearchIcon from "@mui/icons-material/Search";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,  
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedLog, setSelectedLog] =
    useState<any | null>(null);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const response =
        await api.get(
          "/v2/AuditLogs"
        );

      setLogs(response.data);

    } catch (error) {

      console.error(
        "Error loading audit logs",
        error
      );

    }
  };

  const getActionLabel = (
    action: string
    ) => {
    switch (action) {
        case "USER_CREATED":
        return "Usuario Creado";

        case "USER_UPDATED":
        return "Usuario Actualizado";

        case "USER_DELETED":
        return "Usuario Eliminado";

        case "PASSWORD_RESET":
        return "Contraseña Restablecida";

        default:
        return action;
    }
    };

    const getActionColor = (
    action: string
    ):
    "success" |
    "info" |
    "warning" |
    "error" |
    "default" => {

    switch (action) {

        case "USER_CREATED":
        return "success";

        case "USER_UPDATED":
        return "info";

        case "PASSWORD_RESET":
        return "warning";

        case "USER_DELETED":
        return "error";

        default:
        return "default";
    }
    };

    const getAffectedUser = (
    log: any
    ) => {
    try {

        const details =
        JSON.parse(
            log.afterJson
        );

        return (
        details.DisplayName ??
        details.Email ??
        "-"
        );

    } catch {

        return "-";

    }
    };

    const parseBefore = () => {
    try {
        return JSON.parse(
        selectedLog?.beforeJson ?? "{}"
        );
    } catch {
        return {};
    }
    };

    const parseAfter = () => {
    try {
        return JSON.parse(
        selectedLog?.afterJson ?? "{}"
        );
    } catch {
        return {};
    }
    };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography
        variant="h5"
        sx={{ mb: 3 }}
      >
        Auditoría del Sistema
      </Typography>

      <TableContainer>
        <Table>
        <TableHead>
        <TableRow>

            <TableCell>
            Fecha
            </TableCell>

            <TableCell>
            Acción
            </TableCell>

            <TableCell>
            Usuario afectado
            </TableCell>

            <TableCell>
            Realizado por
            </TableCell>

            <TableCell>
            Detalle
            </TableCell>

        </TableRow>
        </TableHead>
          <TableBody>

            {logs.map(log => (

              <TableRow key={log.id}>

                <TableCell>
                    {new Date(
                    log.createdAt
                    ).toLocaleString()}
                </TableCell>

                <TableCell>
                    <Chip
                    size="small"
                    label={
                        getActionLabel(
                        log.action
                        )
                    }
                    color={
                        getActionColor(
                        log.action
                        )
                    }
                    />
                </TableCell>

                <TableCell>
                    {getAffectedUser(log)}
                </TableCell>

                <TableCell>
                    {log.performedBy}
                </TableCell>

                <TableCell>

  <IconButton
    color="primary"
    onClick={() => {
      setSelectedLog(log);
      setDetailsOpen(true);
    }}
  >
    🔍
  </IconButton>

</TableCell>


                </TableRow>

            ))}

          </TableBody>

        </Table>
      </TableContainer>
    <Dialog
  open={detailsOpen}
  onClose={() =>
    setDetailsOpen(false)
  }
  maxWidth="md"
  fullWidth
>

  <DialogTitle>
    Detalle de Auditoría
  </DialogTitle>

  <DialogContent>

    <Typography sx={{ mb: 2 }}>
      Acción:
      {" "}
      {
        selectedLog &&
        getActionLabel(
          selectedLog.action
        )
      }
    </Typography>

    <Typography
    variant="subtitle1"
    sx={{ mb: 1 }}
    >
    Antes
    </Typography>

    <Paper
    sx={{
        p: 2,
        mb: 3
    }}
    >
    <Typography>
        Nombre:
        {" "}
        {parseBefore().DisplayName ?? "-"}
    </Typography>

    <Typography>
        Correo:
        {" "}
        {parseBefore().Email ?? "-"}
    </Typography>
    </Paper>

    <Typography
    variant="subtitle1"
    sx={{ mb: 1 }}
    >
    Después
    </Typography>

    <Paper
    sx={{
        p: 2
    }}
    >
    <Typography>
        Nombre:
        {" "}
        {parseAfter().DisplayName ?? "-"}
    </Typography>

    <Typography>
        Correo:
        {" "}
        {parseAfter().Email ?? "-"}
    </Typography>
    </Paper>

  </DialogContent>

    <DialogActions>

        <Button
        onClick={() =>
            setDetailsOpen(false)
        }
        >
        Cerrar
        </Button>

    </DialogActions>

    </Dialog>
    </Paper>
  );
}