import { useEffect, useState } from "react";

import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
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

    <Button
        variant="contained"
        onClick={() =>
            setOpen(true)
        }
        sx={{ mb: 2 }}
    >
        New Product
    </Button>
<Paper sx={{ mb: 2 }}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>SKU</TableCell>
        <TableCell>Name</TableCell>
        <TableCell>Category</TableCell>
        <TableCell>Brand</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {products.map((product) => (
        <TableRow key={product.id}>
          <TableCell>{product.sku}</TableCell>
          <TableCell>{product.name}</TableCell>
          <TableCell>{product.category}</TableCell>
          <TableCell>{product.brand}</TableCell>
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
</>
);
}