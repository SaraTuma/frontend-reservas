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
import SearchIcon from "@mui/icons-material/Search";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { ReservationService } from "@/services/ReservationService";
import { ServiceService } from "@/services/ServicesService";
import { Reservation, Service, User } from "@/types/ApiResponse";

interface ReservationWithNames extends Reservation {
  clientName: string;
  serviceName: string;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<ReservationWithNames[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const [serviceQuery, setServiceQuery] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };


  const fetchReservations = async () => {
    setLoading(true);
    try {
      const data = await ReservationService.getAll();

      const enriched: ReservationWithNames[] = await Promise.all(
        data.map(async (resv: Reservation) => {

          return {
            ...resv,
            clientName: resv?.clientName ?? "Desconhecido",
            serviceName: resv?.serviceName ?? "Desconhecido",
          };
        })
      );

      setReservations(enriched);
    } catch (error: unknown) {
      if (error instanceof Error) showSnackbar(`Erro ao carregar reservas: ${error.message}`, "error");
      else showSnackbar("Erro ao carregar reservas.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (serviceQuery.trim() !== "") {
        const allServices = await ServiceService.getAll();
        const filtered = allServices.filter((s: Service) =>
          s.name.toLowerCase().includes(serviceQuery.toLowerCase())
        );
        setServices(filtered);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [serviceQuery]);

  const handleCreateReservation = async () => {
    if (!selectedService) {
      showSnackbar("Selecione um serviço.", "error");
      return;
    }

    setSubmitting(true);
    try {
      await ReservationService.create({ serviceId: selectedService.id });
      showSnackbar("Reserva criada com sucesso!", "success");
      setDialogOpen(false);

      await fetchReservations();
    } catch (error: unknown) {
      if (error instanceof Error) showSnackbar(`Erro ao criar reserva: ${error.message}`, "error");
      else showSnackbar("Erro ao criar reserva.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (confirm("Deseja realmente cancelar esta reserva?")) {
      try {
        await ReservationService.cancel(id);
        showSnackbar("Reserva cancelada.", "success");

        await fetchReservations();
      } catch (error: unknown) {
        if (error instanceof Error) showSnackbar(`Erro ao cancelar reserva: ${error.message}`, "error");
        else showSnackbar("Erro ao cancelar reserva.", "error");
      }
    }
  };

  const columns: GridColDef<ReservationWithNames>[] = [
  { field: "id", headerName: "ID", flex: 0.3 },
  { field: "clientName", headerName: "Cliente", flex: 1 },
  { field: "serviceName", headerName: "Serviço", flex: 1 },
  { field: "pricePaid", headerName: "Preço (AOA)", flex: 0.5 },
  { field: "status", headerName: "Status", flex: 0.6 },
  {
    field: "actions",
    headerName: "Ações",
    flex: 0.5,
    renderCell: (params) =>
      params.row.status !== "CANCELED" && (
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
        <Typography variant="h5" fontWeight="bold">Reservas</Typography>
        <Button variant="contained" startIcon={<AddCircleRoundedIcon />} onClick={() => setDialogOpen(true)}>
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
            options={services}
            getOptionLabel={(option) => option.name}
            value={selectedService}
            onChange={(_, value) => setSelectedService(value)}
            inputValue={serviceQuery}
            onInputChange={(_, value) => setServiceQuery(value)}
            loading={services.length === 0 && serviceQuery.trim() !== ""}
            noOptionsText="Nenhum serviço encontrado"
            clearOnEscape
            sx={{ width: "100%", mt: 1, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Serviço"
                placeholder="Digite o nome do serviço"
                margin="dense"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
                      <SearchIcon color="action" />
                    </Box>
                  ),
                  endAdornment: <>{params.InputProps.endAdornment}</>,
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2">{option.name}</Typography>
                {option.description && (
                  <Typography variant="caption" color="text.secondary">{option.description}</Typography>
                )}
              </Box>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateReservation} disabled={submitting}>
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
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
