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
} from "@mui/material";

import {
  getTenants,
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

  const [editingCompany, setEditingCompany] =
    useState<any | null>(null);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await getTenants();
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
    await createTenant({
      name,
      code,
      plan,
      status: 1,
    });

    setOpen(false);

    setName("");
    setCode("");
    setPlan("");

    const data = await getTenants();
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
        status: 1,
      }
    );

    setOpen(false);

    setEditingCompany(null);

    setName("");
    setCode("");
    setPlan("");

    const data = await getTenants();
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

    const data = await getTenants();
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
          ? "Edit Company"
          : "Create Company"}
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
            label="Plan"
            fullWidth
            value={plan}
            onChange={(e) =>
              setPlan(e.target.value)
            }
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => setOpen(false)}
        >
          Cancel
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
            ? "Update"
            : "Create"}
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
          Companies
        </Typography>

        <Button
          variant="contained"
          onClick={() => setOpen(true)}
        >
          New Company
        </Button>
      </Stack>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Plan</TableCell>
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

                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() =>
                        deleteCompany(company.id)
                      }
                    >
                      Delete
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