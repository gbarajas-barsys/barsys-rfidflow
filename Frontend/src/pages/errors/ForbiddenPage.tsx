import {
  Box,
  Typography,
} from "@mui/material";

export default function ForbiddenPage() {
  return (
    <Box sx={{ p: 5 }}>
      <Typography variant="h3">
        403
      </Typography>

      <Typography>
        You do not have permission
        to access this resource.
      </Typography>
    </Box>
  );
}