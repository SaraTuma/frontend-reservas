"use client";

import type { Metadata } from "next";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import AppNavbar from "@/components/dashboard/AppNavbar";
import SideMenu from "@/components/dashboard/SideMenu";
import Stack from "@mui/material/Stack";
import AppTheme from "../../shared-theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "@/theme/customizations";


const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppTheme themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {/* Sidebar fixa */}
        <SideMenu />

        {/* Conteúdo principal */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          {/* Navbar fixa no topo */}
          <AppNavbar />

          {/* Conteúdo dinâmico (aqui entram as páginas /dashboard/*) */}
          <Stack
            sx={{
              flexGrow: 1,
              
              overflowY: "auto",
            }}
          >
            {children}
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
