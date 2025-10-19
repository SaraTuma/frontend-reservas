"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { ReservationService } from "@/services/ReservationService";
import { UserService } from "@/services/UserService";
import { ServiceService } from "@/services/ServicesService";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [clientQuery, setClientQuery] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);

  const [serviceQuery, setServiceQuery] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const data = await ReservationService.getAll();
      setReservations(data);
    } catch {
      showSnackbar("Erro ao carregar reservas.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (clientQuery.trim() !== "") {
        const allUsers = await UserService.getAll();
        const filtered = allUsers.filter((u: any) =>
          u.name.toLowerCase().includes(clientQuery.toLowerCase())
        );
        setClients(filtered);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [clientQuery]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (serviceQuery.trim() !== "") {
        const allServices = await ServiceService.getAll();
        const filtered = allServices.filter((s: any) =>
          s.name.toLowerCase().includes(serviceQuery.toLowerCase())
        );
        setServices(filtered);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [serviceQuery]);

  const handleCreateReservation = async () => {
    if (!selectedClient || !selectedService) {
      showSnackbar("Selecione um cliente e um serviço.", "error");
      return;
    }

    setSubmitting(true);
    try {
      await ReservationService.create({
        clientId: selectedClient.id,
        serviceId: selectedService.id,
      });
      showSnackbar("Reserva criada com sucesso!", "success");
      setDialogOpen(false);
      fetchReservations();
    } catch {
      showSnackbar("Erro ao criar reserva.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (confirm("Deseja realmente cancelar esta reserva?")) {
      try {
        await ReservationService.cancel(id);
        showSnackbar("Reserva cancelada.", "success");
        fetchReservations();
      } catch {
        showSnackbar("Erro ao cancelar reserva.", "error");
      }
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "clientName", headerName: "Cliente", flex: 1 },
    { field: "serviceName", headerName: "Serviço", flex: 1 },
    { field: "status", headerName: "Status", flex: 0.6 },
    {
      field: "actions",
      headerName: "Ações",
      flex: 0.5,
      renderCell: (params) =>
        params.row.status !== "CANCELLED" && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleCancel(params.row.id)}
          >
            Cancelar
          </Button>
        ),
    },
  ];

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Reservas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleRoundedIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Nova Reserva
        </Button>
      </Stack>

      <DataGrid
        rows={reservations}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        style={{ height: 500 }}
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Criar Reserva</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={clients}
            getOptionLabel={(option) => option.name}
            onInputChange={(_, value) => setClientQuery(value)}
            onChange={(_, value) => setSelectedClient(value)}
            renderInput={(params) => (
              <TextField {...params} label="Cliente" margin="dense" fullWidth />
            )}
          />
          <Autocomplete
            options={services}
            getOptionLabel={(option) => option.name}
            onInputChange={(_, value) => setServiceQuery(value)}
            onChange={(_, value) => setSelectedService(value)}
            renderInput={(params) => (
              <TextField {...params} label="Serviço" margin="dense" fullWidth />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleCreateReservation}
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : "Criar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
