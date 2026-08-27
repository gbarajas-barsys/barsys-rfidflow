import { useEffect, useState }
  from "react";

import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";

import {
  presenceService,
} from "../../services/presenceService";

import {
  mockProductionJobs,
} from "../../data/mockProductionJobs";

export default function ProductionTrackingPage() {

  const [rows, setRows] =
    useState<any[]>([]);

  useEffect(() => {

    const presence =
      presenceService.getAll();

    const data =
      mockProductionJobs.map(
        (job) => {

          const assetPresence =
            presence.find(
              (p) =>
                p.epc ===
                job.epc
            );

          return {
            ...job,
            zone:
              assetPresence?.zone ??
              "--",

            antenna:
              assetPresence
                ?.antennaName ??
              "--",

            lastSeen:
              assetPresence
                ?.lastSeen ??
              "--",
          };

        }
      );

    setRows(data);

  }, []);

  return (
    <>

      <Typography
        variant="h4"
        gutterBottom
      >
        Production Tracking
      </Typography>

      <TableContainer
        component={Paper}
      >
        <Table>

          <TableHead>

            <TableRow>

              <TableCell>
                Project
              </TableCell>

              <TableCell>
                Customer
              </TableCell>

              <TableCell>
                Material
              </TableCell>

              <TableCell>
                Current Zone
              </TableCell>

              <TableCell>
                Current Stage
              </TableCell>

              <TableCell>
                Current Antenna
              </TableCell>

              <TableCell>
                Last Seen
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {rows.map(
              (row) => (

                <TableRow
                  key={
                    row.project
                  }
                >

                  <TableCell>
                    {row.project}
                  </TableCell>

                  <TableCell>
                    {row.customer}
                  </TableCell>

                  <TableCell>
                    {row.material}
                  </TableCell>

                  <TableCell>
                    {row.zone}
                  </TableCell>

                  <TableCell>
                    <Chip
                        label={row.zone}
                        color="success"
                        size="small"
                    />
                  </TableCell>

                  <TableCell>
                    {row.antenna}
                  </TableCell>

                  <TableCell>
                    {row.lastSeen}
                  </TableCell>

                </TableRow>

              )
            )}

          </TableBody>

        </Table>

      </TableContainer>

    </>
  );

}