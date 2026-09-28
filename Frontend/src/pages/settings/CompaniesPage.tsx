import { useEffect, useState } from "react";

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
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  MenuItem,
} from "@mui/material";

import {
  getAllTenants,
  createTenant,
  updateTenant,
  deleteTenant,
} from "../../services/tenantService";

export default function CompaniesPage() {

  const [companies, setCompanies] =
    useState<any[]>([]);

  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [plan, setPlan] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  const [logoUrl, setLogoUrl] =
    useState("");

  const [primaryColor, setPrimaryColor] =
    useState("#1976D2");

  const [secondaryColor, setSecondaryColor] =
    useState("#424242");

  const [editingCompany, setEditingCompany] =
    useState<any | null>(null);

  const [credentialsOpen, setCredentialsOpen] =
    useState(false);

  const [createdAdmin, setCreatedAdmin] =
    useState("");

  const [temporaryPassword, setTemporaryPassword] =
    useState("");

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await getAllTenants();
        console.log("Companies:", data);
        setCompanies(data);
      } catch (error) {
        console.error("Error loading companies", error);
      }
    };

    loadCompanies();
  }, []);
  const createCompany = async () => {
  try {
    const result =
      await createTenant({
        name,
        code,
        plan,

        adminName,
        adminEmail,

        logoUrl,
        primaryColor,
        secondaryColor,
    });

    setCreatedAdmin(
      result.adminUser
    );

    setTemporaryPassword(
      result.temporaryPassword
    );

setCredentialsOpen(true);

    setOpen(false);

    setName("");
    setCode("");
    setPlan("");
    setLogoUrl("");
    setAdminName("");
    setAdminEmail("");
    setPrimaryColor("#1976D2");
    setSecondaryColor("#424242");

    const data = await getAllTenants();
    setCompanies(data);
  } catch (error) {
    console.error(
      "Error creating company",
      error
    );
  }
};

  const updateCompany = async () => {
  if (!editingCompany) return;

  try {
    await updateTenant(
      editingCompany.id,
      {
        id: editingCompany.id,
        name,
        code,
        plan,
        logoUrl,
        primaryColor,
        secondaryColor,
        status: 1,
      }
    );

    setOpen(false);

    setEditingCompany(null);

    setName("");
    setCode("");
    setPlan("");
    setLogoUrl("");
    setAdminName("");
    setAdminEmail("");
    setPrimaryColor("#1976D2");
    setSecondaryColor("#424242");

    const data = await getAllTenants();
    setCompanies(data);
  } catch (error) {
    console.error(
      "Error updating company",
      error
    );
  }
};

  const deleteCompany = async (
  id: string
) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this company?"
  );

  if (!confirmed) return;

  try {
    await deleteTenant(id);

    const data = await getAllTenants();
    setCompanies(data);
  } catch (error) {
    console.error(
      "Error deleting company",
      error
    );
  }
};

  return (
    <>
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {editingCompany
          ? "Actualizar"
          : "Crear"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Company Name"
            fullWidth
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <TextField
            label="Code"
            fullWidth
            value={code}
            onChange={(e) =>
              setCode(e.target.value)
            }
          />

          <TextField
            select
            label="Plan"
            fullWidth
            value={plan}
            onChange={(e) =>
              setPlan(e.target.value)
            }
          >
            <MenuItem value="ACTIVOS">
              Activos
            </MenuItem>

            <MenuItem value="INVENTARIO">
              Inventario
            </MenuItem>

            <MenuItem value="RFIDFLOW_360">
              RFIDFlow 360
            </MenuItem>
          </TextField>

          <TextField
            label="Administrator Name"
            fullWidth
            value={adminName}
            onChange={(e) =>
              setAdminName(e.target.value)
            }
          />

          <TextField
            label="Administrator Email"
            fullWidth
            value={adminEmail}
            onChange={(e) =>
              setAdminEmail(e.target.value)
            }
          />
  
          <TextField
            label="Logo URL"
            fullWidth
            value={logoUrl}
            onChange={(e) =>
              setLogoUrl(e.target.value)
            }
          />

          <TextField
            label="Primary Color"
            fullWidth
            value={primaryColor}
            onChange={(e) =>
              setPrimaryColor(e.target.value)
            }
          />

          <TextField
            label="Secondary Color"
            fullWidth
            value={secondaryColor}
            onChange={(e) =>
              setSecondaryColor(e.target.value)
            }
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => setOpen(false)}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={
            editingCompany
              ? updateCompany
              : createCompany
          }
        >
          {editingCompany
            ? "Actualizar"
            : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>

    <Dialog
        open={credentialsOpen}
        onClose={() =>
          setCredentialsOpen(false)
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Compañía Creada Satisfactoriamente
        </DialogTitle>

        <DialogContent>

          <Stack spacing={2} sx={{ mt: 1 }}>

            <Typography>
              Usuario Administrador
            </Typography>

            <TextField
              value={createdAdmin}
              fullWidth
              InputProps={{
                readOnly: true
              }}
            />

            <Typography>
              Contraseña Temporal
            </Typography>

            <TextField
              value={temporaryPassword}
              fullWidth
              InputProps={{
                readOnly: true
              }}
            />

            <Typography color="warning.main">
              Guarde estas credenciales.
              El administrador las usará para su 
              primer inicio de sesión.
            </Typography>

          </Stack>

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() => {

              navigator.clipboard.writeText(
              `Usuario: ${createdAdmin}
              Contraseña: ${temporaryPassword}`
              );

              alert(
                "Credenciales copiadas al portapapeles"
              );

            }}
          >
            Copiar
          </Button>

          <Button
            variant="contained"
            onClick={() =>
              setCredentialsOpen(false)
            }
          >
            Cerrar
          </Button>

        </DialogActions>

      </Dialog>

    <Paper sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Typography variant="h5">
          Empresas
        </Typography>

        <Button
          variant="contained"
          onClick={() => {

            setEditingCompany(null);

            setName("");
            setCode("");
            setPlan("");

            setAdminName("");
            setAdminEmail("");

            setLogoUrl("");

            setPrimaryColor("#1976D2");
            setSecondaryColor("#424242");

            setOpen(true);
          }}
        >
          Nueva Empresa
        </Button>
      </Stack>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Primary</TableCell>
              <TableCell>Secondary</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.code}>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.code}</TableCell>
                <TableCell>{company.plan}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: 1,
                      bgcolor:
                        company.primaryColor ??
                        "#1976D2",
                      border: "1px solid #666"
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: 1,
                      bgcolor:
                        company.secondaryColor ??
                        "#424242",
                      border: "1px solid #666"
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Chip
                    label={
                      company.status === 1
                        ? "Active"
                        : "Inactive"
                    }
                    color={
                      company.status === 1
                        ? "success"
                        : "warning"
                    }
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  <Stack
                    direction="row"
                    spacing={1}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setEditingCompany(company);

                        setName(company.name);
                        setCode(company.code);
                        setPlan(company.plan);
                        setAdminName("");
                        setAdminEmail("");

                        setLogoUrl(
                          company.logoUrl ?? ""
                        );

                        setPrimaryColor(
                          company.primaryColor ??
                          "#1976D2"
                        );

                        setSecondaryColor(
                          company.secondaryColor ??
                          "#424242"
                        );

                        setOpen(true);
                      }}
                    >
                      Editar
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() =>
                        deleteCompany(company.id)
                      }
                    >
                      Borrar
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
    </>
  );
}