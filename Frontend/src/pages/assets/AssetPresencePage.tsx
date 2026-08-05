import { useEffect, useState } from "react";

import {
  Paper,
  Typography,
  Grid,
  Chip,
  Divider,
} from "@mui/material";

import {
  getPresence,
} from "../../services/presenceApi";

import type {
  PresenceRecord,
} from "../../services/presenceApi";

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
    useState<
      AssetPresence[]
    >([]);

  useEffect(() => {
    const refresh =
      async () => {
        try {
          const assets: Asset[] =
            JSON.parse(
              localStorage.getItem(
                "rfidflow-assets"
              ) ?? "[]"
            );

          const backendPresence =
            await getPresence();
            console.log(
  "ASSETS",
  assets.map(a => a.epc)
);

console.log(
  "BACKEND",
  backendPresence.map(
    p => p.epc
  )
);

          const data =
            assets
              .filter(
                (asset) =>
                  asset.epc
              )
              .map(
                (asset) => {
                  const record =
  backendPresence.find(
    (
      p: PresenceRecord
    ) =>
      p.epc
        .trim()
        .toUpperCase() ===
      (asset.epc ?? "")
        .trim()
        .toUpperCase()
  );
  console.log(
  "MATCHING",
  asset.epc,
  backendPresence.map(
    (p) => p.epc
  )
);

                  return {
                    assetId:
                      asset.id,
                    assetName:
                      asset.name,
                    epc:
                      asset.epc ??
                      "",
                    lastSeen:
                      record
                        ?.lastSeen ??
                      "--",
                    present:
                      record
                        ?.present ??
                      false,
                  };
                }
              );

          setPresence(
            data
          );
        } catch (
          error
        ) {
          console.error(
            error
          );
        }
      };

    refresh();

    const interval =
      window.setInterval(
        refresh,
        3000
      );

    return () =>
      clearInterval(
        interval
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
                No hay activos RFID registrados.
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </>
  );
}