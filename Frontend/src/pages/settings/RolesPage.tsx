import { useEffect, useState } from "react";
import { api } from "../../api/apiClient";
import {PERMISSION_GROUPS, PERMISSION_LABELS} from "../../security/permissions";


import {
  Paper,
  Typography,
  Box,
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

export default function RolesPage() {
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRoleCode, setSelectedRoleCode] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedRoleName, setSelectedRoleName] = useState("");
  
useEffect(() => {
  loadRoles();
}, []);

const loadRoles = async () => {
  try {

    const response =
      await api.get(
        "/v2/Roles?page=1&pageSize=50"
      );

    setRoles(
      response.data
    );

  } catch (error) {

    console.error(
      "Error loading roles",
      error
    );

  }
};

const savePermissions = async () => {
  try {

    await api.patch(
      `/v2/Roles/${selectedRoleId}`,
      {
        name:
          selectedRoleName,

        code:
          selectedRoleCode,

        permissions:
          selectedPermissions
      }
    );

    await loadRoles();

    setOpen(false);

  } catch (error) {

    console.error(
      "Error saving permissions",
      error
    );

  }
};
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

                      setSelectedRoleName(
                        role.name
                      );

                      setSelectedRoleCode(
                        role.code
                      );

                      setSelectedRoleId(
                        role.id
                      );

                      setSelectedPermissions(
                        role.permissions ?? []
                      );

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
            {Object.entries(
              PERMISSION_GROUPS
            ).map(
              ([group, permissions]) => (

                <Box
                  key={group}
                  sx={{
                    mb: 2,
                    border: "1px solid #444",
                    borderRadius: 1,
                    p: 1
                  }}
                >

                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: "bold",
                      mb: 1
                    }}
                  >
                    {group}
                  </Typography>

                  {permissions.map(
                    permission => (

                      <FormControlLabel
                        key={permission}
                        control={
                          <Checkbox
                            checked={
                              selectedPermissions.includes(
                                permission
                              )
                            }
                            onChange={(e) => {

                              if (
                                e.target.checked
                              ) {

                                setSelectedPermissions([
                                  ...selectedPermissions,
                                  permission
                                ]);

                              } else {

                                setSelectedPermissions(
                                  selectedPermissions.filter(
                                    p =>
                                      p !==
                                      permission
                                  )
                                );

                              }

                            }}
                          />
                        }
                        label={
                          PERMISSION_LABELS[
                            permission as keyof
                            typeof PERMISSION_LABELS
                          ]
                        }
                      />

                    )
                  )}

                </Box>

              )
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={savePermissions}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}