import { useState } from "react";

import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Chip,
} from "@mui/material";

const roles = [
  {
    name: "Super Admin",
    code: "SUPER_ADMIN",
    permissions: [
      "Dashboard",
      "Inventory",
      "Assets",
      "Asset Presence",
      "RFID",
      "RFID Live",
      "Work Orders",
      "Reports",
      "Administration"
    ]
  },

  {
    name: "Company Admin",
    code: "COMPANY_ADMIN",
    permissions: [
      "Dashboard",
      "Inventory",
      "Assets",
      "Asset Presence",
      "Reports"
    ]
  },

  {
    name: "Operator",
    code: "OPERATOR",
    permissions: [
      "Dashboard",
      "Inventory",
      "Assets",
      "Asset Presence"
    ]
  },

  {
    name: "Viewer",
    code: "VIEWER",
    permissions: [
      "Dashboard",
      "Asset Presence"
    ]
  }
];

const modules = [
  "Dashboard",
  "Inventory",
  "Assets",
  "Asset Presence",
  "RFID",
  "RFID Live",
  "Work Orders",
  "Reports",
  "Administration",
];

export default function RolesPage() {
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPermissions, setSelectedPermissions] =
    useState<string[]>([]);

  return (
    <Paper sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h5">
          Roles & Permissions
        </Typography>

        <Button variant="contained">
          New Role
        </Button>
      </Stack>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Role</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Permissions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.code}>
                <TableCell>
                  {role.name}
                </TableCell>

                <TableCell>
                  {role.code}
                </TableCell>

                <TableCell>
                  <Chip
                    label="Active"
                    color="success"
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSelectedRole(role.name);
                      setSelectedPermissions(role.permissions);
                      setOpen(true);
                    }}
                  >
                    Manage Permissions
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Permissions - {selectedRole}
        </DialogTitle>

        <DialogContent>
          <Stack sx={{ mt: 1 }}>
            {modules.map((module) => (
              <FormControlLabel
                key={module}
                control={
                  <Checkbox
                    checked={selectedPermissions.includes(module)}
                  />
                }
                label={module}
              />
            ))}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={() => setOpen(false)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}