"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../../../shared-theme/AppTheme";
import Image from "next/image";
import { useRouter } from "next/navigation"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ToastProvider";
import { AuthService } from "@/services/AuthService";

const schema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  nif: z.string().min(5, "O NIF é obrigatório."),
  email: z.string().email("Insira um e-mail válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

type FormData = z.infer<typeof schema>;

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function SignUp(props: { disableCustomTheme?: boolean }) {
  const router = useRouter()
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
     
    try {
      const response = await AuthService.register(data.email, data.password, data.name, data.nif, "CLIENT")
      showToast("success", response.message || "Cadastro realizado com sucesso!");
      router.push('/login')
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast("error", error.message || "Erro ao criar conta.");
      } else {
        console.error("Ocorreu um erro desconhecido", error);
      }
    } 
   
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
           <Box sx={{ display: { xs: 'flex'} }}>
          <Image
            src="/aoservices.png"
            alt="Logo"
            width={200}
            height={50}
            style={{ borderRadius: 12 }}
          />
      </Box>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Criar conta
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Nome</FormLabel>
              <TextField
                fullWidth
                id="name"
                placeholder="Jon Snow"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="nif">NIF</FormLabel>
              <TextField
                fullWidth
                id="nif"
                placeholder="100001001"
                {...register("nif")}
                error={!!errors.nif}
                helperText={errors.nif?.message}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="email">E-mail</FormLabel>
              <TextField
                fullWidth
                id="email"
                placeholder="seu@email.com"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">Senha</FormLabel>
              <TextField
                fullWidth
                type="password"
                id="password"
                placeholder="••••••"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </FormControl>

            <div></div>

            <Button type="submit" fullWidth variant="contained" disabled={isSubmitting}>
              {isSubmitting ? "Criando conta..." : "Criar minha conta"}
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography sx={{ textAlign: "center" }}>
              Já tenho uma conta?{" "}
              <Link href="/login" variant="body2" sx={{ alignSelf: "center" , color: 'primary.main'}}>
                Login
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
