import { useEffect, useState } from "react";

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
  category: string;
  brand: string;
  description: string;
  cost: number;
  price: number;
};

export default function ProductsPage() {
  const [products, setProducts] =
    useState<Product[]>(() => {
      const stored =
        localStorage.getItem(
          "rfidflow-products"
        );

      return stored
        ? JSON.parse(stored)
        : [];
    });

  const [open, setOpen] =
    useState(false);

  const [sku, setSku] =
    useState("");

  const [name, setName] =
    useState("");

  const [category,
    setCategory] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [description,
    setDescription] =
    useState("");

  const [cost, setCost] =
    useState("");

  const [price, setPrice] =
    useState("");

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
  previewOpen,
  setPreviewOpen,
] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      "rfidflow-products",
      JSON.stringify(
        products
      )
    );
  }, [products]);

  const addProduct = () => {
    setProducts([
      ...products,
      {
        id:
          crypto.randomUUID(),
        sku,
        name,
        category,
        brand,
        description,
        cost:
          Number(cost),
        price:
          Number(price),
      },
    ]);

    setSku("");
    setName("");
    setCategory("");
    setBrand("");
    setDescription("");
    setCost("");
    setPrice("");

    setOpen(false);
  };

 const exportTemplate = () => {
  const rows = [
    [
      "SKU",
      "Name",
      "Category",
      "Brand",
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
            category,
            brand,
          ] =
            row.split(",");

          return {
            id:
              crypto.randomUUID(),
            sku:
              sku?.trim() ?? "",
            name:
              name?.trim() ?? "",
            category:
              category?.trim() ?? "",
            brand:
              brand?.trim() ?? "",
            description:
              "",
            cost: 0,
            price: 0,
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
      product.category
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      product.brand
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
  );
  const deleteProduct = (
  id: string
) => {
  setProducts(
    products.filter(
      (product) =>
        product.id !== id
    )
  );
};

const confirmDelete = () => {
  if (!selectedProduct) {
    return;
  }

  deleteProduct(
    selectedProduct.id
  );

  setDeleteDialogOpen(
    false
  );

  setSelectedProduct(
    null
  );
};
const saveProductChanges = () => {
  if (!editingProduct) {
    return;
  }

  setProducts(
    products.map(
      (product) =>
        product.id ===
        editingProduct.id
          ? editingProduct
          : product
    )
  );

  setEditOpen(false);

setEditingProduct(null);

setSuccessOpen(true);
};
  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        Products
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
                Products
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
  label="Search Product"
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
        New Product
    </Button>
<Button variant="outlined" onClick={exportTemplate} sx={{ mb: 2, ml: 2 }}>Export Template</Button>
<Button
  variant="outlined"
  component="label"
  sx={{ mb: 2, ml: 2 }}
>
  Import Products

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
        <TableCell>Name</TableCell>
        <TableCell>Category</TableCell>
        <TableCell>Brand</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {filteredproducts.map((product) => (
        <TableRow key={product.id}>
          <TableCell>{product.sku}</TableCell>
          <TableCell>{product.name}</TableCell>
          <TableCell>{product.category}</TableCell>
          <TableCell>{product.brand}</TableCell>
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
    Edit
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
    Delete
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
    New Product
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
    label="Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />

  <TextField
    fullWidth
    margin="dense"
    label="Category"
    value={category}
    onChange={(e) => setCategory(e.target.value)}
  />

  <TextField
    fullWidth
    margin="dense"
    label="Brand"
    value={brand}
    onChange={(e) => setBrand(e.target.value)}
  />
</DialogContent>

<DialogActions>
  <Button
    onClick={() => setOpen(false)}
  >
    Cancel
  </Button>

  <Button
    variant="contained"
    onClick={addProduct}
  >
    Save
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
    Confirm Delete
  </DialogTitle>

  <DialogContent>
    <Typography>
      SKU: {selectedProduct?.sku}
    </Typography>

    <Typography>
      Name: {selectedProduct?.name}
    </Typography>

    <Typography sx={{ mt: 2 }}>
      Are you sure you want to
      delete this product?
    </Typography>
  </DialogContent>

  <DialogActions>
    <Button
      onClick={() =>
        setDeleteDialogOpen(false)
      }
    >
      Cancel
    </Button>

    <Button
      color="error"
      variant="contained"
      onClick={confirmDelete}
    >
      Delete
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
    Edit Product
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
      label="Name"
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
      label="Category"
      value={
        editingProduct?.category ??
        ""
      }
      onChange={(e) =>
        setEditingProduct(
          {
            ...editingProduct!,
            category:
              e.target.value,
          }
        )
      }
    />

    <TextField
      fullWidth
      margin="dense"
      label="Brand"
      value={
        editingProduct?.brand ??
        ""
      }
      onChange={(e) =>
        setEditingProduct(
          {
            ...editingProduct!,
            brand:
              e.target.value,
          }
        )
      }
    />
  </DialogContent>

  <DialogActions>
    <Button
      onClick={() =>
        setEditOpen(false)
      }
    >
      Cancel
    </Button>

    <Button
  variant="contained"
  onClick={saveProductChanges}
>
  Save
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
    Product updated successfully
  </Alert>
</Snackbar>
</>
);
}