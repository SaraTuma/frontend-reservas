"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/services/privateApi";
import { useAuth } from "@/hooks/useAuth";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

const loginSchema = z.object({
  emailOrNif: z
    .string()
    .min(3, "Informe seu e-mail ou NIF corretamente"),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { login } = useAuth({ requireAuth: false });
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    try {
      setLoading(true);
      setErrorMessage("");
      const response = await api.post("/auth/login", data);

      const { token, data: userData } = response.data;
      login(token, userData.user);

      router.push("/dashboard"); // 🔄 redireciona após login
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "Erro ao fazer login. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Acesse sua conta
      </Typography>

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <TextField
        label="E-mail ou NIF"
        variant="outlined"
        fullWidth
        {...register("emailOrNif")}
        error={!!errors.emailOrNif}
        helperText={errors.emailOrNif?.message}
      />

      <TextField
        label="Senha"
        type="password"
        variant="outlined"
        fullWidth
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        sx={{ mt: 1 }}
      >
        {loading ? <CircularProgress size={24} /> : "Entrar"}
      </Button>
    </Box>
  );
}
