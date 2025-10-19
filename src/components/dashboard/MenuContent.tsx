"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import { useEffect, useState } from "react";
import { getUser } from "@/utils/token";

const mainListItems = [
  { text: "Início", icon: <HomeRoundedIcon />, href: "/dashboard" },
  { text: "Usuários", icon: <PeopleRoundedIcon />, href: "/dashboard/users", role: "ADMIN" }, // 👈 restringido
  { text: "Serviços", icon: <AssignmentRoundedIcon />, href: "/dashboard/services" },
  { text: "Reservas", icon: <AnalyticsRoundedIcon />, href: "/dashboard/reservations" },
  { text: "Histórico", icon: <AnalyticsRoundedIcon />, href: "/dashboard/transactions" },
];

const secondaryListItems = [
  { text: "Definições", icon: <SettingsRoundedIcon />, content: "Aqui você pode configurar suas preferências." },
  { text: "Sobre", icon: <InfoRoundedIcon />, content: "Aplicativo de dashboard criado com Next.js e MUI." },
  { text: "Ajuda", icon: <HelpRoundedIcon />, content: "Para suporte, contate suporte@aoservices.com." },
];

export default function MenuContent() {
  const pathname = usePathname();
  const [openModal, setOpenModal] = React.useState(false);
  const [modalContent, setModalContent] = React.useState("");

  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  
    useEffect(() => {
      setMounted(true);
      const u = getUser();
      setUser(u);
    }, []);

  const handleOpenModal = (content: string) => {
    setModalContent(content);
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const filteredMainItems = mainListItems.filter(
    (item) => !item.role || item.role === user?.role
  );
   if (!mounted) return null;

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {filteredMainItems.map((item, index) => {
          const selected = pathname === item.href;
          return (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={selected}
                sx={{
                  borderRadius: 2,
                  color: selected ? "primary.main" : "text.primary",
                  "& .MuiListItemIcon-root": {
                    minWidth: 32,
                    color: selected ? "primary.main" : "text.secondary",
                  },
                  "&:hover": { backgroundColor: "action.hover" },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={() => handleOpenModal(item.content)}
              sx={{
                borderRadius: 2,
                color: "text.primary",
                "& .MuiListItemIcon-root": { minWidth: 32, color: "text.secondary" },
                "&:hover": { backgroundColor: "action.hover" },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Informação</DialogTitle>
        <DialogContent>
          <DialogContentText>{modalContent}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
