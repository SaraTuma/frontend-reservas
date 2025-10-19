"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Stack, Typography, Snackbar, Alert } from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import ServiceTable from "./components/ServiceTable";
import ServiceDialog from "./components/ServiceDialog";
import { ServiceService } from "@/services/ServicesService";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await ServiceService.getAll();
      console.log("SERVICES RESPONSE:", data);
      setServices(data);
    } catch {
      showSnackbar("Erro ao carregar serviços.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAdd = () => {
    setSelectedService(null);
    setDialogOpen(true);
  };

  const handleEdit = (service: any) => {
    setSelectedService(service);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este serviço?")) {
      try {
        await ServiceService.delete(id);
        showSnackbar("Serviço excluído com sucesso!", "success");
        fetchServices();
      } catch {
        showSnackbar("Erro ao excluir serviço.", "error");
      }
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (selectedService) {
        await ServiceService.update(selectedService.id, data);
        showSnackbar("Serviço atualizado com sucesso!", "success");
      } else {
        await ServiceService.create(data);
        showSnackbar("Serviço criado com sucesso!", "success");
      }
      fetchServices();
    } catch {
      showSnackbar("Erro ao salvar serviço.", "error");
    } finally {
      setDialogOpen(false);
    }
  };

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Serviços
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleRoundedIcon />}
          onClick={handleAdd}
        >
          Novo Serviço
        </Button>
      </Stack>

      <ServiceTable
        services={services}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ServiceDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        service={selectedService}
      />

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
