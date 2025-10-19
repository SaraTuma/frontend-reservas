"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  user?: any | null;
}

export default function UserDialog({ open, onClose, onSave, user }: Props) {
  const [form, setForm] = useState({ name: "", email: "", role: "CLIENT" });

  useEffect(() => {
    if (user) setForm(user);
    else setForm({ name: "", email: "", role: "CLIENT" });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{user ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            name="name"
            label="Nome"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="role"
            label="Tipo de Usuário"
            select
            value={form.role}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="CLIENT">Cliente</MenuItem>
            <MenuItem value="PROVIDER">Prestador</MenuItem>
            <MenuItem value="ADMIN">Administrador</MenuItem>
          </TextField>
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
