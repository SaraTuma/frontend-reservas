"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import Copyright from "../internals/components/Copyright";
import HighlightedCard from "./HighlightedCard";
import StatCard, { StatCardProps } from "./StatCard";
import { StatsService } from "@/services/StatsService";

export default function MainGrid() {
  const [data, setData] = useState<StatCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const stats = await StatsService.getCounts();

      const formatted: StatCardProps[] = [
        {
          title: "Usuários",
          value: stats.users?.toString() ?? "0",
          interval: "Total cadastrado",
          trend: "neutral",
        },
        {
          title: "Serviços",
          value: stats.services?.toString() ?? "0",
          interval: "Total ativo",
          trend: "neutral",
        },
        {
          title: "Reservas",
          value: stats.reservations?.toString() ?? "0",
          interval: "Total registrado",
          trend: "neutral",
        },
      ];

      setData(formatted);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Visão geral
      </Typography>

      <Stack
        spacing={2}
        sx={{
          justifyContent: "space-between",
          height: "85vh",
        }}
      >
        <Grid
          container
          spacing={2}
          columns={12}
          sx={{ mb: (theme) => theme.spacing(2) }}
        >
          {loading ? (
            <Typography sx={{ ml: 2 , mt: 4}}>Carregando estatísticas...</Typography>
          ) : (
            <>
              {data.map((card, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
                  <StatCard {...card} />
                </Grid>
              ))}
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <HighlightedCard />
              </Grid>
            </>
          )}
        </Grid>

        <Copyright sx={{ my: 4 }} />
      </Stack>
    </Box>
  );
}
