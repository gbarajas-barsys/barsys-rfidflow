import { useEffect, useState } from "react";
import { api } from "../../api/apiClient";
import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography
} from "@mui/material";

export default function ItemsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api
      .get("/v2/Items?page=1&pageSize=50")
      .then((response) => setItems(response.data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Inventario
      </Typography>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SKU</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Unidad</TableCell>
              <TableCell>Activo</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.unitOfMeasure}</TableCell>
                <TableCell>
                  {item.active ? "✅" : "❌"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}