import { CircularProgress, Box, Typography } from "@mui/material";

export default function Loading() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <CircularProgress size={60} thickness={5} />
    </Box>
  );
}
