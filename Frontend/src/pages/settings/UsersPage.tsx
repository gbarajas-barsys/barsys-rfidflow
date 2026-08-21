import { useEffect, useState } from "react";

import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

type User = {
  id: string;
  email: string;
  displayName: string;
  status: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [displayName, setDisplayName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");
  const [editingUser, setEditingUser] =
  useState<User | null>(null);

  useEffect(() => {
  loadUsers();  
}, []);

const createUser = async () => {
  try {
    const response = await fetch(
      "http://localhost:8080/v2/Users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          displayName,
          phone,
          status: 0,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Error creating user");
    }

    setOpen(false);

    setDisplayName("");
    setEmail("");
    setPhone("");

    loadUsers();
  } catch (error) {
    console.error(
      "Error creating user",
      error
    );
  }
};

const updateUser = async () => {
  if (!editingUser) return;

  try {
    const response = await fetch(
      `http://localhost:8080/v2/Users/${editingUser.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingUser.id,
          email,
          displayName,
          phone,
          status: 0,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Error updating user");
    }

    setOpen(false);

    setEditingUser(null);

    setDisplayName("");
    setEmail("");
    setPhone("");

    loadUsers();
  } catch (error) {
    console.error(
      "Error updating user",
      error
    );
  }
};

const deleteUser = async (id: string) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this user?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `http://localhost:8080/v2/Users/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Error deleting user");
    }

    loadUsers();
  } catch (error) {
    console.error(
      "Error deleting user",
      error
    );
  }
};

const loadUsers = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/v2/Users?page=1&pageSize=50"
      );

      const data: User[] = await response.json();

      setUsers(data);
    } catch (error) {
      console.error("Error loading users", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Typography variant="h5">
          Users
        </Typography>

        <Button
          variant="contained"
          onClick={() => setOpen(true)}
        >
          New User
        </Button>
      </Stack>

      {loading && <Typography>Loading users...</Typography>}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user.email}>
                <TableCell>{user.displayName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>

                <TableCell>
                  <Chip
                    label={user.status === 0 ? "Active" : "Inactive"}
                    color="success"
                    size="small"
                  />
                </TableCell>
                
                <TableCell>
                  <Stack
                    direction="row"
                    spacing={1}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setEditingUser(user);

                        setDisplayName(user.displayName);
                        setEmail(user.email);
                        setPhone(user.phone ?? "");

                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() =>
                        deleteUser(user.id)
                      }
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingUser
            ? "Edit User"
            : "Create User"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Display Name"
              fullWidth
              value={displayName}
              onChange={(e) =>
                setDisplayName(e.target.value)
              }
            />

            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <TextField
              label="Phone"
              fullWidth
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setEditingUser(null);
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={
              editingUser
                ? updateUser
                : createUser
            }
          >
            {editingUser
              ? "Update"
              : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}