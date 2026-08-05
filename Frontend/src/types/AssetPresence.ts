import { useEffect, useState } from "react";

import {
  Paper,
  Typography,
  Grid,
  Chip,
  Divider,
} from "@mui/material";

type Asset = {
  id: string;
  name: string;
  assetNumber: string;
  epc?: string;
  location?: string;
};

type AssetPresence = {
  assetId: string;
  assetName: string;
  epc: string;
  lastSeen: string;
  present: boolean;
};

export default function AssetPresencePage() {
  const [presence, setPresence] =
    useState<AssetPresence[]>(
      []
    );

  useEffect(() => {
    const assets: Asset[] =
      JSON.parse(
        localStorage.getItem(
          "rfidflow-assets"
        ) ?? "[]"
      );

    const presenceData =
      assets
        .filter(
          (a) => a.epc
        )
        .map(
          (asset) => ({
            assetId:
              asset.id,
            assetName:
              asset.name,
            epc:
              asset.epc ?? "",
            lastSeen:
              "--",
            present:
              false,
          })
        );

    setPresence(
      presenceData
    );
  }, []);

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        Asset Presence
      </Typography>

      <Grid
        container
        spacing={3}
      >
        {presence.map(
          (asset) => (
            <Grid
              item
              xs={12}
              md={4}
              key={
                asset.assetId
              }
            >
              <Paper
                sx={{
                  p: 3,
                }}
              >
                <Typography
                  variant="h6"
                >
                  {
                    asset.assetName
                  }
                </Typography>

                <Divider
                  sx={{
                    my: 2,
                  }}
                />

                <Typography
                  variant="body2"
                >
                  EPC
                </Typography>

                <Typography>
                  {
                    asset.epc
                  }
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                  }}
                >
                  Last Seen
                </Typography>

                <Typography>
                  {
                    asset.lastSeen
                  }
                </Typography>

                <Chip
                  sx={{
                    mt: 2,
                  }}
                  color={
                    asset.present
                      ? "success"
                      : "error"
                  }
                  label={
                    asset.present
                      ? "Present"
                      : "Not Present"
                  }
                />
              </Paper>
            </Grid>
          )
        )}

        {presence.length ===
          0 && (
          <Grid
            item
            xs={12}
          >
            <Paper
              sx={{
                p: 3,
              }}
            >
              <Typography>
                No hay
                activos RFID
                registrados.
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </>
  );
}