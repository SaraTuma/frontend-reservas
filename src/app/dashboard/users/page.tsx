"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Stack, Typography, Snackbar, Alert } from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import UserTable from "./components/UserTable";
import UserDialog from "./components/UserDialog";
import { UserService } from "@/services/UserService";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/AuthService";
import { getUser } from "@/utils/token";

export default function UsersPage() {
  const router = useRouter();
  const  user  = getUser(); // exemplo: { id, name, role }
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    if (!user) router.push("/login");
    if (user.role === "CLIENT") {
      router.push("/dashboard");
      showSnackbar("Acesso negado.", "error");
    } else {
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let data;
      if (user.role === "ADMIN") {
        data = await UserService.getAll();
      } else if (user.role === "PROVIDER") {
        data = await UserService.getClientsByProvider(user.id);
      }
      setUsers(data || []);
    } catch (err) {
      console.error(err);
      showSnackbar("Erro ao carregar usuários.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleEdit = (u: any) => {
    setSelectedUser(u);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await UserService.delete(id);
        showSnackbar("Usuário excluído com sucesso!", "success");
        fetchUsers();
      } catch {
        showSnackbar("Erro ao excluir usuário.", "error");
      }
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (selectedUser) {
        await UserService.update(selectedUser.id, data);
        showSnackbar("Usuário atualizado com sucesso!", "success");
      } else {
        await AuthService.register(data.name, data.nif, data.email, data.password, data.role);
        showSnackbar("Usuário criado com sucesso!", "success");
      }
      fetchUsers();
    } catch {
      showSnackbar("Erro ao salvar usuário.", "error");
    } finally {
      setDialogOpen(false);
    }
  };

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Usuários
        </Typography>
        {user.role === "ADMIN" && (
          <Button
            variant="contained"
            startIcon={<AddCircleRoundedIcon />}
            onClick={handleAdd}
          >
            Novo Usuário
          </Button>
        )}
      </Stack>

      <UserTable users={users} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

      <UserDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        user={selectedUser}
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
