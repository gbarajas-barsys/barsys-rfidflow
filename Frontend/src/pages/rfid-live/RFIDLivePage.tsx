import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import QuickAssetRegistrationDialog 
    from "./components/QuickAssetRegistrationDialog";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";

type RFIDRead = {
  epc: string;
  timestamp: string;
};

type Asset = {
  id: string;
  name: string;
  assetNumber: string;
  epc?: string;
  location?: string;
};

type DetectedAsset = {
  id: string;
  name: string;
  epc?: string;
  location?: string;
  lastSeen: string;
};

type UnknownTag = {
  epc: string;
  timestamp: string;
};

export default function RFIDLivePage() {
  const [reads, setReads] = useState<
    RFIDRead[]
  >([]);

  const [lastAsset, setLastAsset] =
    useState<Asset | null>(null);

  const [lastUnknownTag, setLastUnknownTag] =
    useState<string | null>(null);

  const [dialogOpen, setDialogOpen] =
  useState(false);

  const [selectedTag, setSelectedTag] =
  useState("");

  const [assetName, setAssetName] =
  useState("");

  const [assetNumber, setAssetNumber] =
  useState("");

  const [assetLocation, setAssetLocation] =
  useState("");

  const [
    detectedAssets,
    setDetectedAssets,
  ] = useState<
    DetectedAsset[]
  >([]);

  const [
    unknownTags,
    setUnknownTags,
  ] = useState<
    UnknownTag[]
  >([]);

  const registerAsset = () => {
  const assets: Asset[] = JSON.parse(
    localStorage.getItem(
      "rfidflow-assets"
    ) ?? "[]"
  );

  const newAsset: Asset = {
    id: crypto.randomUUID(),
    name: assetName,
    assetNumber,
    epc: selectedTag,
    location: assetLocation,
  };

  localStorage.setItem(
    "rfidflow-assets",
    JSON.stringify([
      ...assets,
      newAsset,
    ])
  );

  setUnknownTags((previous) =>
    previous.filter(
      (tag) =>
        tag.epc !== selectedTag
    )
  );

  setSelectedTag("");
  setAssetName("");
  setAssetNumber("");
  setAssetLocation("");
  setDialogOpen(false);
};

  useEffect(() => {
    const interval = setInterval(() => {
      const assets: Asset[] =
        JSON.parse(
          localStorage.getItem(
            "rfidflow-assets"
          ) ?? "[]"
        );

      const assetsWithTag =
        assets.filter(
          (asset) => asset.epc
        );

      if (
        assetsWithTag.length === 0
      ) {
        return;
      }

      const generateUnknown =
        Math.random() < 0.2;

      const newRead = generateUnknown
        ? {
            epc:
              "E2806999" +
              Math.floor(
                Math.random() *
                  100000000
              ),
            timestamp:
              new Date().toLocaleTimeString(),
          }
        : {
            epc:
              assetsWithTag[
                Math.floor(
                  Math.random() *
                    assetsWithTag.length
                )
              ].epc ?? "",
            timestamp:
              new Date().toLocaleTimeString(),
          };

      setReads((prev) => [
        newRead,
        ...prev,
      ].slice(0, 20));

      const match = assets.find(
        (asset) =>
          asset.epc === newRead.epc
      );

      if (match) {
        setLastAsset(match);

        setLastUnknownTag(null);

        setDetectedAssets(
          (previous) => {
            const filtered =
              previous.filter(
                (asset) =>
                  asset.id !==
                  match.id
              );

            return [
              {
                id: match.id,
                name: match.name,
                epc: match.epc,
                location:
                  match.location,
                lastSeen:
                  newRead.timestamp,
              },
              ...filtered,
            ].slice(0, 10);
          }
        );
      } else {
        setLastAsset(null);

        setLastUnknownTag(
          newRead.epc
        );

        setUnknownTags(
          (previous) => {
            const exists =
              previous.some(
                (tag) =>
                  tag.epc ===
                  newRead.epc
              );

            if (exists)
              return previous;

            return [
              {
                epc: newRead.epc,
                timestamp:
                  newRead.timestamp,
              },
              ...previous,
            ].slice(0, 20);
          }
        );
      }
    }, 3000);

    return () =>
      clearInterval(interval);
  }, []);

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        RFID Live
      </Typography>

      <Grid
        container
        spacing={3}
      >
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Reader Status
              </Typography>

              <Chip
                label="Online"
                color="success"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Reader
              </Typography>

              <Typography>
                Impinj R700
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Total Reads
              </Typography>

              <Typography variant="h3">
                {reads.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Unknown Tags
              </Typography>

              <Typography variant="h3">
                {unknownTags.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={3}
        sx={{ mt: 2 }}
      >
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
            >
              Last Detected Asset
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {lastAsset && (
              <>
                <Typography
                  color="success.main"
                  fontWeight="bold"
                >
                  ✅ Asset Reconocido
                </Typography>

                <Typography sx={{ mt: 1 }}>
                  Nombre: {lastAsset.name}
                </Typography>

                <Typography>
                  EPC: {lastAsset.epc}
                </Typography>

                <Typography>
                  Ubicación:{" "}
                  {lastAsset.location ??
                    "Sin ubicación"}
                </Typography>
              </>
            )}

            {!lastAsset &&
              lastUnknownTag && (
                <>
                  <Typography
                    color="warning.main"
                    fontWeight="bold"
                  >
                    ⚠ EPC No Registrado
                  </Typography>

                  <Typography sx={{ mt: 1 }}>
                    {lastUnknownTag}
                  </Typography>
                </>
              )}

            {!lastAsset &&
              !lastUnknownTag && (
                <Typography>
                  Esperando lecturas...
                </Typography>
              )}
          </Paper>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={3}
        sx={{ mt: 2 }}
      >
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
            >
              Recently Detected Assets
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <List>
              {detectedAssets.map(
                (asset) => (
                  <ListItem
                    key={asset.id}
                  >
                    <ListItemText
                      primary={asset.name}
                      secondary={`Última lectura: ${asset.lastSeen}`}
                    />
                  </ListItem>
                )
              )}

              {detectedAssets.length === 0 && (
                <ListItemText
                    primary="Sin activos detectados"
                  />
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
            >
              Unknown Tags Registry
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <List>
                {unknownTags.map((tag) => (
                    <ListItem
                        key={tag.epc}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: 1,
                        }}
                    >
                        <ListItemText
                            primary={tag.epc}
                            secondary={tag.timestamp}
                        />

                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                                setSelectedTag(tag.epc);
                                setDialogOpen(true);
                            }}
                        >
                            Registrar Asset
                    </Button>
                    </ListItem>
                ))}

                {unknownTags.length === 0 && (
                    <ListItemText
                        primary="Sin tags desconocidos"
                    />
                )}
            </List>
          </Paper>
        </Grid>

        <Grid
  container
  spacing={3}
  sx={{ mt: 2 }}
>
  <Grid item xs={12}>
    <Paper sx={{ p: 3 }}>
      <Typography
        variant="h6"
        gutterBottom
      >
        Reader Health
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          xs={12}
          md={2}
        >
          <Typography
            color="success.main"
            fontWeight="bold"
          >
            🟢 Online
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          md={2}
        >
          <Typography
            fontWeight="bold"
          >
            Reader
          </Typography>

          <Typography>
            Impinj R700
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          md={2}
        >
          <Typography
            fontWeight="bold"
          >
            Last Read
          </Typography>

          <Typography>
            {reads.length > 0
              ? reads[0]
                  .timestamp
              : "--"}
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          md={2}
        >
          <Typography
            fontWeight="bold"
          >
            Read Rate
          </Typography>

          <Typography>
            {reads.length * 20}
            {" "}
            tags/min
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          md={2}
        >
          <Typography
            fontWeight="bold"
          >
            Recognized
          </Typography>

          <Typography>
            {
              detectedAssets.length
            }
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          md={2}
        >
          <Typography
            fontWeight="bold"
          >
            Unknown
          </Typography>

          <Typography>
            {
              unknownTags.length
            }
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  </Grid>
</Grid>
      </Grid>

      <Paper
        sx={{
          p: 3,
          mt: 3,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
        >
          Live EPC Feed
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <List>
          {reads.map(
            (read, index) => (
              <ListItem
                key={index}
              >
                <ListItemText
                  primary={read.epc}
                  secondary={
                    read.timestamp
                  }
                />
              </ListItem>
            )
          )}
        </List>
            </Paper>

      <QuickAssetRegistrationDialog
        open={dialogOpen}
        epc={selectedTag}
        name={assetName}
        assetNumber={assetNumber}
        location={assetLocation}
        onNameChange={setAssetName}
        onAssetNumberChange={setAssetNumber}
        onLocationChange={setAssetLocation}
        onClose={() =>
          setDialogOpen(false)
        }
        onSave={registerAsset}
      />
    </>
  );
}