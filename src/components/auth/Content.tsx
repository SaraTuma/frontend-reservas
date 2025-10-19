import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import Image from "next/image";

const items = [
  {
    icon: <EventAvailableRoundedIcon sx={{ color: 'primary.main' }} />,
    title: 'Reservas Simplificadas',
    description:
      'Agende espaços e serviços com apenas alguns cliques. Sem complicações, sem filas.',
  },
  {
    icon: <SpeedRoundedIcon sx={{ color: 'primary.main' }} />,
    title: 'Gestão Rápida e Eficiente',
    description:
      'Acompanhe todas as suas reservas em tempo real e mantenha o controle total do seu tempo.',
  },
  {
    icon: <InsightsRoundedIcon sx={{ color: 'primary.main' }} />,
    title: 'Relatórios Inteligentes',
    description:
      'Analise estatísticas e relatórios automáticos para otimizar a gestão das suas reservas.',
  },
];

export default function Content() {
  return (
    <Stack
      sx={{
        flexDirection: 'column',
        alignSelf: 'center',
        gap: 4,
        maxWidth: 450,
      }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
       <Image
          src="/aoservices.png"
          alt="Logo"
          width={200}
          height={50}
          style={{ borderRadius: 12 }}
        />
        
      </Box>

      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <Box>
            <Typography 
              gutterBottom
              sx={{
                fontWeight: 600,
                fontSize: '1rem',
                color: 'primary.main'
              }}
            >
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}
