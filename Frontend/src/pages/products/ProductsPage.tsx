import { useEffect, useState } from "react";
import { api } from "../../api/apiClient";

import {
  Alert,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

type Product = {
  id: string;
  sku: string;
  name: string;
  description: string;
  unitOfMeasure: string;
  barcode: string;
  minStock: number;
  maxStock: number;
  active: boolean;
};

export default function ProductsPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [open, setOpen] =
    useState(false);

  const [sku, setSku] =
    useState("");

  const [name, setName] =
    useState("");

  const [description,
    setDescription] =
    useState("");
  
  const [
      unitOfMeasure,
      setUnitOfMeasure
    ] = useState("PCS");

    const [
      barcode,
      setBarcode
    ] = useState("");

    const [
      minStock,
      setMinStock
    ] = useState("0");

    const [
      maxStock,
      setMaxStock
    ] = useState("0");

  const [search, setSearch] =
    useState("");

    const [
  deleteDialogOpen,
  setDeleteDialogOpen,
] = useState(false);

const [
  selectedProduct,
  setSelectedProduct,
] = useState<Product | null>(
  null
);
const [
  editOpen,
  setEditOpen,
] = useState(false);

const [
  editingProduct,
  setEditingProduct,
] = useState<Product | null>(
  null
);
const [
  previewProducts,
  setPreviewProducts,
] = useState<Product[]>([]);

const [
  successOpen,
  setSuccessOpen,
] = useState(false);

const [
  importSuccessOpen,
  setImportSuccessOpen,
] = useState(false);

const [
  previewOpen,
  setPreviewOpen,
] = useState(false);

const loadProducts = async () => {
  try {

    const response =
      await api.get(
        "/v2/Items?page=1&pageSize=50"
      );

    setProducts(
      response.data
    );

  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  loadProducts();
}, []);

  const addProduct = async () => {

    try {

      await api.post(
        "/v2/Items",
        {
          sku,
          name,
          description,
          unitOfMeasure,
          barcode,
          minStock:
            Number(minStock),
          maxStock:
            Number(maxStock),
          active: true
        }
      );

      await loadProducts();

      setOpen(false);

      setSku("");
      setName("");
      setDescription("");
      setUnitOfMeasure("PCS");
      setBarcode("");
      setMinStock("0");
      setMaxStock("0");

    } catch (error) {

      console.error(error);

      alert(
        "Error creando producto"
      );
    }
  };

 const exportTemplate = () => {
  const rows = [
    [
      "SKU",
      "Nombre",
      "Descripcion",
      "Unidad",
      "CodigoBarras",
      "StockMinimo",
      "StockMaximo",
    ],
  ];

  const csv =
    rows
      .map((row) =>
        row.join(",")
      )
      .join("\n");

  const blob =
    new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;",
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const link =
    document.createElement(
      "a"
    );

  link.href = url;

  link.download =
    "ProductsTemplate.csv";

  link.click();

  URL.revokeObjectURL(url);
};
const handleImport = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file =
    event.target.files?.[0];

  if (!file) {
    return;
  }

  const reader =
    new FileReader();

  reader.onload = (
    e
  ) => {
    const text =
      e.target?.result as string;

    const rows =
      text
        .split("\n")
        .slice(1)
        .filter(
          (row) =>
            row.trim()
        );

    const importedProducts =
      rows.map(
        (row) => {
          const [
            sku,
            name,
            description,
            unitOfMeasure,
            barcode,
            minStock,
            maxStock,
          ] = row.split(",");

          return {
            id: crypto.randomUUID(),

            sku:
              sku?.trim() ?? "",

            name:
              name?.trim() ?? "",

            description:
              description?.trim() ?? "",

            unitOfMeasure:
              unitOfMeasure?.trim() ??
              "PCS",

            barcode:
              barcode?.trim() ?? "",

            minStock:
              Number(minStock ?? 0),

            maxStock:
              Number(maxStock ?? 0),

            active: true,
          };
        }
      );

    setPreviewProducts(
  importedProducts
);

setPreviewOpen(
  true
);
  };

  reader.readAsText(
    file
  );
};
const filteredproducts =
  products.filter(
    (product) =>
      product.sku
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      product.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      product.description
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
  );

  const duplicateProducts =
  previewProducts.filter(
    (preview) =>
      products.some(
        (existing) =>
          existing.sku.toLowerCase() ===
          preview.sku.toLowerCase()
      )
  );

const validProducts =
  previewProducts.filter(
    (preview) =>
      !products.some(
        (existing) =>
          existing.sku.toLowerCase() ===
          preview.sku.toLowerCase()
      )
  );

  const deleteProduct =
    async (
      id: string
    ) => {

      try {

        await api.delete(
          `/v2/Items/${id}`
        );

        await loadProducts();

      } catch (error) {

        console.error(error);

        alert(
          "Error eliminando producto"
        );
      }
  };

const confirmDelete =
  async () => {

    if (!selectedProduct) {
      return;
    }

    await deleteProduct(
      selectedProduct.id
    );

    setDeleteDialogOpen(
      false
    );

    setSelectedProduct(
      null
    );
};

const saveProductChanges =
  async () => {

    if (!editingProduct) {
      return;
    }

    try {

      await api.patch(
        `/v2/Items/${editingProduct.id}`,
        editingProduct
      );

      await loadProducts();

      setEditOpen(false);

      setEditingProduct(null);

      setSuccessOpen(true);

    } catch (error) {

      console.error(error);

      alert(
        "Error actualizando producto"
      );
    }
};

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        Catálogo de Productos
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Grid
          item
          xs={12}
          md={3}
        >
          <Card>
            <CardContent>
              <Typography>
                Productos
              </Typography>

              <Typography
                variant="h3"
              >
                {
                  products.length
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
<TextField
  fullWidth
  label="Buscar Producto"
  value={search}
  onChange={(e) =>
    setSearch(
      e.target.value
    )
  }
  sx={{ mb: 2 }}
/>
    <Button
        variant="contained"
        onClick={() =>
            setOpen(true)
        }
        sx={{ mb: 2 }}
    >
        Nuevo Producto
    </Button>
<Button variant="outlined" onClick={exportTemplate} sx={{ mb: 2, ml: 2 }}>Exportar Plantilla</Button>
<Button
  variant="outlined"
  component="label"
  sx={{ mb: 2, ml: 2 }}
>
  Importar Productos

  <input
    hidden
    type="file"
    accept=".csv"
    onChange={handleImport}
  />
</Button>
<Paper sx={{ mb: 2 }}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>SKU</TableCell>
        <TableCell>Nombre</TableCell>
        <TableCell>Descripción</TableCell>
        <TableCell>Unidad</TableCell>
        <TableCell>Min</TableCell>
        <TableCell>Max</TableCell>
        <TableCell>Activo</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {filteredproducts.map((product) => (
        <TableRow key={product.id}>
          <TableCell>{product.sku}</TableCell>
          <TableCell>{product.name}</TableCell>
          <TableCell>
            {product.description}
          </TableCell>

          <TableCell>
            {product.unitOfMeasure}
          </TableCell>

          <TableCell>
            {product.minStock}
          </TableCell>

          <TableCell>
            {product.maxStock}
          </TableCell>

          <TableCell>
            {product.active
              ? "✅"
              : "❌"}
          </TableCell>
    <TableCell>
  <Button
    size="small"
    onClick={() => {
      setEditingProduct(
        product
      );

      setEditOpen(
        true
      );
    }}
  >
    Editar
  </Button>

  <Button
    color="error"
    size="small"
    onClick={() => {
      setSelectedProduct(
        product
      );

      setDeleteDialogOpen(
        true
      );
    }}
  >
    Eliminar
  </Button>
</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</Paper>
<Dialog
  open={open}
  onClose={() =>
    setOpen(false)
  }
>
  <DialogTitle>
    Nuevo Producto
  </DialogTitle>

<DialogContent>
  <TextField
    fullWidth
    margin="dense"
    label="SKU"
    value={sku}
    onChange={(e) => setSku(e.target.value)}
  />

  <TextField
    fullWidth
    margin="dense"
    label="Nombre"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />

  <TextField
    fullWidth
    margin="dense"
    label="Descripción"
    value={description}
    onChange={(e) =>
      setDescription(
        e.target.value
      )
    }
  />

  <TextField
    fullWidth
    margin="dense"
    label="Unidad"
    value={unitOfMeasure}
    onChange={(e) =>
      setUnitOfMeasure(
        e.target.value
      )
    }
  />

  <TextField
    fullWidth
    margin="dense"
    label="Código de Barras"
    value={barcode}
    onChange={(e) =>
      setBarcode(
        e.target.value
      )
    }
  />

  <TextField
    fullWidth
    type="number"
    margin="dense"
    label="Stock Mínimo"
    value={minStock}
    onChange={(e) =>
      setMinStock(
        e.target.value
      )
    }
  />

  <TextField
    fullWidth
    type="number"
    margin="dense"
    label="Stock Máximo"
    value={maxStock}
    onChange={(e) =>
      setMaxStock(
        e.target.value
      )
    }
  />
</DialogContent>

<DialogActions>
  <Button
    onClick={() => setOpen(false)}
  >
    ararar
  </Button>

  <Button
    variant="contained"
    onClick={addProduct}
  >
    Guardar
  </Button>
</DialogActions>

</Dialog>
<Dialog
  open={deleteDialogOpen}
  onClose={() =>
    setDeleteDialogOpen(false)
  }
>
  <DialogTitle>
    Confirmar Eliminación
  </DialogTitle>

  <DialogContent>
    <Typography>
      SKU: {selectedProduct?.sku}
    </Typography>

    <Typography>
      Nombre: {selectedProduct?.name}
    </Typography>

    <Typography sx={{ mt: 2 }}>
      ¿Está seguro de que desea
      eliminar este producto?
    </Typography>
  </DialogContent>

  <DialogActions>
    <Button
      onClick={() =>
        setDeleteDialogOpen(false)
      }
    >
      Cancelar
    </Button>

    <Button
      color="error"
      variant="contained"
      onClick={confirmDelete}
    >
      Eliminar
    </Button>
  </DialogActions>
</Dialog>
<Dialog
  open={editOpen}
  onClose={() =>
    setEditOpen(false)
  }
>
  <DialogTitle>
    Editar Producto
  </DialogTitle>

  <DialogContent>
    <TextField
      fullWidth
      margin="dense"
      label="SKU"
      value={
        editingProduct?.sku ?? ""
      }
      onChange={(e) =>
        setEditingProduct(
          {
            ...editingProduct!,
            sku:
              e.target.value,
          }
        )
      }
    />

    <TextField
      fullWidth
      margin="dense"
      label="Nombre"
      value={
        editingProduct?.name ??
        ""
      }
      onChange={(e) =>
        setEditingProduct(
          {
            ...editingProduct!,
            name:
              e.target.value,
          }
        )
      }
    />

    <TextField
      fullWidth
      margin="dense"
      label="Descripción"
      value={
        editingProduct?.description ?? ""
      }
      onChange={(e) =>
        setEditingProduct({
          ...editingProduct!,
          description:
            e.target.value,
        })
      }
    />

    <TextField
      fullWidth
      margin="dense"
      label="Unidad"
      value={
        editingProduct?.unitOfMeasure ?? ""
      }
      onChange={(e) =>
        setEditingProduct({
          ...editingProduct!,
          unitOfMeasure:
            e.target.value,
        })
      }
    />

    <TextField
      fullWidth
      margin="dense"
      label="Código de Barras"
      value={
        editingProduct?.barcode ?? ""
      }
      onChange={(e) =>
        setEditingProduct({
          ...editingProduct!,
          barcode:
            e.target.value,
        })
      }
    />

    <TextField
      fullWidth
      type="number"
      margin="dense"
      label="Stock Mínimo"
      value={
        editingProduct?.minStock ?? 0
      }
      onChange={(e) =>
        setEditingProduct({
          ...editingProduct!,
          minStock:
            Number(
              e.target.value
            ),
        })
      }
    />

    <TextField
      fullWidth
      type="number"
      margin="dense"
      label="Stock Máximo"
      value={
        editingProduct?.maxStock ?? 0
      }
      onChange={(e) =>
        setEditingProduct({
          ...editingProduct!,
          maxStock:
            Number(
              e.target.value
            ),
        })
      }
    />
  </DialogContent>

  <DialogActions>
    <Button
      onClick={() =>
        setEditOpen(false)
      }
    >
      Cancelar
    </Button>

    <Button
  variant="contained"
  onClick={saveProductChanges}
>
  Guardar
</Button>
  </DialogActions>
</Dialog>
<Dialog
  open={previewOpen}
  onClose={() =>
    setPreviewOpen(false)
  }
  maxWidth="md"
  fullWidth
>
  <DialogTitle>
  Vista Previa de Importación (
  {previewProducts.length}
  Productos)
</DialogTitle>

  <DialogContent>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>SKU</TableCell>
          <TableCell>Nombre</TableCell>
          <TableCell>Descripción</TableCell>
          <TableCell>Unidad</TableCell>
          <TableCell>Min</TableCell>
          <TableCell>Max</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {previewProducts.map(
          (product) => (
            <TableRow
              key={product.id}
            >
              <TableCell>
                {product.sku}
              </TableCell>

              <TableCell>
                {product.name}
              </TableCell>

              <TableCell>
                {product.description}
              </TableCell>

              <TableCell>
                {product.unitOfMeasure}
              </TableCell>

              <TableCell>
                {product.minStock}
              </TableCell>

              <TableCell>
                {product.maxStock}
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  </DialogContent>
<Typography
  color="success.main"
  sx={{ mb: 2 }}
>
  Productos Nuevos: {validProducts.length}
</Typography>

<Typography
  color="warning.main"
  sx={{ mb: 2 }}
>
  Duplicados: {duplicateProducts.length}
</Typography>
  <DialogActions>
  <Button
    onClick={() =>
      setPreviewOpen(false)
    }
  >
    Cancelar
  </Button>

<Button
  variant="contained"
  onClick={async () => {

    try {

      for (
        const product
        of validProducts
      ) {

        await api.post(
          "/v2/Items",
          {
            sku:
              product.sku,
            name:
              product.name,
            description:
              product.description,
            unitOfMeasure:
              product.unitOfMeasure,
            barcode:
              product.barcode,
            minStock:
              product.minStock,
            maxStock:
              product.maxStock,
            active: true
          }
        );
      }

      await loadProducts();

      setPreviewOpen(false);

      setPreviewProducts([]);

      setImportSuccessOpen(true);

    } catch (error) {

      console.error(error);

      alert(
        "Error al importar productos"
      );
    }
  }}
>
  Importar Productos
</Button>
</DialogActions>
</Dialog>
<Snackbar
  open={successOpen}
  autoHideDuration={3000}
  onClose={() =>
    setSuccessOpen(false)
  }
>
  <Alert
    severity="success"
    variant="filled"
  >
    Producto actualizado correctamente
  </Alert>
</Snackbar>
<Snackbar
  open={importSuccessOpen}
  autoHideDuration={3000}
  onClose={() =>
    setImportSuccessOpen(false)
  }
>
  <Alert
    severity="success"
    variant="filled"
  >
    Products imported successfully
  </Alert>
</Snackbar>
</>
);
}