import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";

interface ReservationData {
  clientId: string;
  serviceId: string;
  date: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: ReservationData) => void;
  reservation?: ReservationData | null;
}

export default function ReservationDialog({ open, onClose, onSave, reservation }: Props) {
  const [form, setForm] = useState<ReservationData>({
    clientId: reservation?.clientId || "",
    serviceId: reservation?.serviceId || "",
    date: reservation?.date || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{reservation ? "Editar Reserva" : "Nova Reserva"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            name="clientId"
            label="ID do Cliente"
            value={form.clientId}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="serviceId"
            label="ID do Serviço"
            value={form.serviceId}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="date"
            label="Data"
            type="datetime-local"
            value={form.date}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
