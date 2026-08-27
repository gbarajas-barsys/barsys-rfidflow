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
} from "@mui/material";

import {
  presenceService,
} from "../../services/presenceService";

import {
  mockProductionJobs,
} from "../../data/mockProductionJobs";

import {
  productionZones,
} from "../../data/productionZones";

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

  const getStageStatus = (
  currentZone: string,
  stage: string
    ) => {

    const currentIndex =
        productionZones.indexOf(
        currentZone
        );

    const stageIndex =
        productionZones.indexOf(
        stage
        );

    if (
        currentIndex === -1 ||
        stageIndex === -1
    ) {
        return "❌";
    }

    if (
        stageIndex < currentIndex
    ) {
        return "✅";
    }

    if (
        stageIndex === currentIndex
    ) {
        return "⏳";
    }

    return "❌";
    };
  const getProgress = (
    currentZone: string
    ) => {
        
    const currentIndex =
        productionZones.indexOf(
        currentZone
        );

    if (currentIndex === -1) {
        return "0 / " +
        productionZones.length;
    }

    return `${
        currentIndex + 1
    } / ${
        productionZones.length
    }`;

    };

   const getProgressPercentage = (
    currentZone: string
    ) => {

    const currentIndex =
        productionZones.indexOf(
        currentZone
        );

    if (currentIndex === -1) {
        return 0;
    }

    return Math.round(
        ((currentIndex + 1) /
        productionZones.length) *
        100
    );
    };

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
                Progress
              </TableCell>
              
              {productionZones.map(
                (stage) => (
                    <TableCell
                    key={stage}
                    align="center"
                    >
                    {stage}
                    </TableCell>
                )
                )}
              
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
                    {getProgressPercentage(
                        row.zone
                        )}%
                  </TableCell>
                  
                  {productionZones.map(
                    (stage) => (
                        <TableCell
                        key={stage}
                        align="center"
                        >
                        {
                            getStageStatus(
                            row.zone,
                            stage
                            )
                        }
                        </TableCell>
                    )
                    )}

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