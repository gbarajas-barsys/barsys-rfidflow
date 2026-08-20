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
} from "@mui/material";

import { getTenants } from "../../services/tenantService";

const companies = [
  {
    name: "ABB",
    code: "ABB",
    plan: "Enterprise",
    status: "Active",
  },
  {
    name: "Siemens",
    code: "SIEMENS",
    plan: "Enterprise",
    status: "Active",
  },
  {
    name: "Demo Company",
    code: "DEMO",
    plan: "Trial",
    status: "Trial",
  },
];

export default function CompaniesPage() {

  const [companies, setCompanies] = useState<any[]>([]);

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

  return (
    <Paper sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Typography variant="h5">
          Companies
        </Typography>

        <Button variant="contained">
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
                    label={company.status}
                    color={
                      company.status === "Active"
                        ? "success"
                        : "warning"
                    }
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}