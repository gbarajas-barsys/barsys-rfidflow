import { useEffect, useState } from "react";
import { api } from "../../api/apiClient";

import {
  Box,
  Button,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  MenuItem
} from "@mui/material";

export default function RfidTemplatesPage() {

  const [templates, setTemplates] =
    useState<any[]>([]);

  const [variables, setVariables] =
    useState<string[]>([]);

  const [dialogOpen,
    setDialogOpen] =
    useState(false);

  const [editingTemplate,
    setEditingTemplate] =
    useState<any>(null);

  const [name, setName] =
    useState("");

  const [code, setCode] =
    useState("");

  const [templateType,
    setTemplateType] =
    useState("ASSET");

  const [zplTemplate,
    setZplTemplate] =
    useState("");

  const [preview,
    setPreview] =
    useState("");

  const [labelWidth,
    setLabelWidth] =
    useState(102);

    const [labelHeight,
    setLabelHeight] =
    useState(51);

  const loadTemplates =
    async () => {

      try {

        const response =
          await api.get(
            "/v2/rfid/templates"
          );

        setTemplates(
          response.data
        );

      } catch (error) {

        console.error(error);

      }

    };

  const loadVariables =
    async () => {

      try {

        const response =
          await api.get(
            "/v2/rfid/templates/variables"
          );

        setVariables(
          response.data
        );

      } catch (error) {

        console.error(error);

      }

    };

    const redrawPreview =
        () => {

            let value =
            zplTemplate;

            value =
            value.replaceAll(
                "{{TENANT_NAME}}",
                "ACERO ESTRELLA"
            );

            value =
            value.replaceAll(
                "{{ASSET_NAME}}",
                "LAPTOP DELL LATITUDE"
            );

            value =
            value.replaceAll(
                "{{ASSET_NUMBER}}",
                "AF-000123"
            );

            value =
            value.replaceAll(
                "{{SKU}}",
                "SKU-001"
            );

            value =
            value.replaceAll(
                "{{ITEM_NAME}}",
                "TARJETA RFID UHF"
            );

            value =
            value.replaceAll(
                "{{EPC}}",
                "1790003200109"
            );

            const barcodeDetected =
            value.includes("^BC");

            const previewLines =
            value
                .split("\n")
                .filter(
                line =>
                    line.includes("^FD")
                )
                .map(
                line =>
                    line
                    .replace("^FD", "")
                    .replace("^FS", "")
                    .trim()
                );

                setPreview(
                previewLines.join("\n\n") +
                (
                    barcodeDetected
                    ? "\n\n||||||||||||||||||||||||||||"
                    : ""
                )
                );

        };

  useEffect(() => {

    loadTemplates();

    loadVariables();

    }, []);

  useEffect(() => {

    redrawPreview();

    }, [
    zplTemplate,
    labelWidth,
    labelHeight
    ]);

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        mb={2}
      >

        <Typography variant="h4">
          RFID Templates
        </Typography>

        <Typography
        color="text.secondary"
        >
        {templates.length}
        {" "}plantillas registradas
        </Typography>

        <Button
          variant="contained"
          onClick={() => {

            setEditingTemplate(null);

            setName("Asset Standard");
            setCode("ASSET_STANDARD");
            setTemplateType("ASSET");

            setLabelWidth(102);

            setLabelHeight(51);
            setZplTemplate([
                "^XA",
                "^CF0,30",
                "",
                "^FO20,20",
                "^FD{{TENANT_NAME}}^FS",
                "",
                "^FO20,60",
                "^FD{{ASSET_NAME}}^FS",
                "",
                "^FO20,100",
                "^FD{{EPC}}^FS",
                "^BC",
                "^FD{{EPC}}^FS",
                "",
                "^XZ"
            ].join("\n"));

            setDialogOpen(true);

          }}
        >
          Nueva Plantilla
        </Button>

      </Box>

      <Paper>

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>
                Nombre
              </TableCell>

              <TableCell>
                Código
              </TableCell>

              <TableCell>
                Tipo
              </TableCell>

              <TableCell>
                Activa
              </TableCell>

              <TableCell>
                Acciones
              </TableCell>

              <TableCell>
                Default
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {templates.map(
              template => (

                <TableRow
                  key={template.id}
                >

                  <TableCell>
                    {template.name}
                  </TableCell>

                  <TableCell>
                    {template.code}
                  </TableCell>

                  <TableCell>
                    {template.templateType}
                  </TableCell>

                  <TableCell>
                    {template.isActive
                        ? "Sí"
                        : "No"}
                    </TableCell>

                  <TableCell>

                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {

                        setEditingTemplate(
                          template
                        );

                        setName(
                          template.name
                        );

                        setCode(
                          template.code
                        );

                        setTemplateType(
                          template.templateType
                        );

                        setZplTemplate(
                          template.zplTemplate
                        );

                        setLabelWidth(
                        template.labelWidth ?? 102
                        );

                        setLabelHeight(
                        template.labelHeight ?? 51
                        );

                        setDialogOpen(true);

                      }}
                    >
                      Editar
                    </Button>

                  </TableCell>

                  <TableCell>
                    {template.isDefault
                        ? "⭐"
                        : ""}
                  </TableCell>

                </TableRow>

              )
            )}

          </TableBody>

        </Table>

      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={() =>
          setDialogOpen(false)
        }
        maxWidth="lg"
        fullWidth
      >

        <DialogTitle>
        {
            editingTemplate
            ? "Editar Plantilla RFID"
            : "Nueva Plantilla RFID"
        }
        </DialogTitle>

        <DialogContent>

          <TextField
            fullWidth
            margin="dense"
            label="Nombre"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />

          <TextField
            fullWidth
            margin="dense"
            label="Código"
            value={code}
            onChange={(e) =>
              setCode(
                e.target.value
              )
            }
          />

          <TextField
            select
            fullWidth
            margin="dense"
            label="Tipo"
            value={templateType}
            onChange={(e) =>
                setTemplateType(
                e.target.value
                )
            }
            >
            <MenuItem value="ASSET">
                Asset
            </MenuItem>

            <MenuItem value="PRODUCT">
                Product
            </MenuItem>

            <MenuItem value="ON_METAL">
                On Metal Tag
            </MenuItem>
            </TextField>

            <Box
            sx={{
                display: "flex",
                gap: 2,
                mt: 2,
                mb: 2
            }}
            >
            <TextField
                type="number"
                fullWidth
                label="Ancho (mm)"
                value={labelWidth}
                onChange={(e) =>
                setLabelWidth(
                    Number(e.target.value)
                )
                }
            />

            <TextField
                type="number"
                fullWidth
                label="Alto (mm)"
                value={labelHeight}
                onChange={(e) =>
                setLabelHeight(
                    Number(e.target.value)
                )
                }
            />
            </Box>

          <Typography
            sx={{ mt: 2 }}
            fontWeight={600}
          >
            Variables Disponibles
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 1 }}
            >
            Haga clic en una variable para
            insertarla en la plantilla.
            </Typography>

          <Box
            sx={{
              mb: 2,
              mt: 1,
              display: "flex",
              flexWrap: "wrap",
              gap: 1
            }}
          >

            {variables.map(
              variable => (

                <Chip
                key={variable}
                clickable
                color="primary"
                size="small"
                label={`{{${variable}}}`}
                onClick={() => {

                    setZplTemplate(
                    current =>
                        current +
                        `\n{{${variable}}}`
                    );

                }}
                />

              )
            )}

          </Box>

          <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                mt: 2
            }}
            >
          <Box>

            <Typography
                fontWeight={600}
                sx={{ mb: 1 }}
            >
                Editor ZPL
            </Typography>

            <TextField
                fullWidth
                multiline
                rows={20}
                spellCheck={false}
                label="ZPL Template"
                placeholder="Pegue o diseñe aquí su ZPL..."
                value={zplTemplate}
                onChange={(e) =>
                setZplTemplate(
                    e.target.value
                )
                }
                InputProps={{
                style: {
                    fontFamily:
                    "Consolas, monospace"
                }
                }}
            />

            </Box>

            <Box>

            <Typography
                fontWeight={600}
                sx={{ mb: 1 }}
            >
                Vista Previa
            </Typography>

            <Paper
                variant="outlined"
                sx={{
                    p: 3,
                    height: 520,
                    overflow: "auto",
                    backgroundColor: "white",
                    color: "#111111",
                    borderRadius: 2
                }}
                >

                <Box
                sx={{
                    border: "2px solid #222",
                    width: labelWidth * 3,
                    height: labelHeight * 3,
                    margin: "0 auto",
                    p: 3,
                    backgroundColor: "#fff"
                }}
                >

                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    RFIDFLOW
                </Typography>

                <Typography
                sx={{
                    mt: 2,
                    whiteSpace: "pre-line"
                }}
                >
                {preview}
                </Typography>

                </Box>

            </Paper>

            </Box>
            </Box>

            </DialogContent>

            <DialogActions>

            <Button
                onClick={() =>
                setDialogOpen(false)
                }
            >
                Cancelar
            </Button>

            <Button
                variant="contained"
                onClick={async () => {

                try {

                    if (editingTemplate) {

                    await api.patch(
                    `/v2/rfid/templates/${editingTemplate.id}`,
                    {
                        ...editingTemplate,

                        name,
                        code,

                        templateType,

                        zplTemplate,

                        labelWidth,
                        labelHeight
                    }
                    );

                    } else {

                    await api.post(
                    "/v2/rfid/templates",
                    {
                        name,
                        code,

                        templateType,

                        zplTemplate,

                        labelWidth,
                        labelHeight,

                        isDefault: false,
                        isActive: true
                    }
                    );

                    }

                    await loadTemplates();

                    setDialogOpen(false);

                } catch (error) {

                    console.error(error);

                }

                }}
            >
                Guardar
            </Button>

        </DialogActions>

    </Dialog>

    </>
    );
}