"use client";

import * as React from "react";
import { styled } from "@mui/material/styles";
import Divider, { dividerClasses } from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MuiMenuItem from "@mui/material/MenuItem";
import Paper, { paperClasses } from "@mui/material/Paper";
import { listClasses } from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon, { listItemIconClasses } from "@mui/material/ListItemIcon";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import MenuButton from "./MenuButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth"; // supondo que você tenha
import { getUser } from "@/utils/token";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const MenuItem = styled(MuiMenuItem)({
  margin: "2px 0",
});

export default function OptionsMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openAccountModal, setOpenAccountModal] = React.useState(false);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const { logoutGoToLogin, logout } = useAuth({requireAuth:true});
  const user = getUser(); 
  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleMinhaConta = () => {
    setOpenAccountModal(true);
    handleClose();
  };

  const handleCriarNovaConta = () => {
    logout(); 
    router.push("/register");
    handleClose();
  };

  const handleSair = () => {
    logoutGoToLogin();
    handleClose();
  };

  return (
    <React.Fragment>
      <MenuButton
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ borderColor: "transparent" }}
      >
        <MoreVertRoundedIcon />
      </MenuButton>

      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{
          [`& .${listClasses.root}`]: { padding: "4px" },
          [`& .${paperClasses.root}`]: { padding: 0 },
          [`& .${dividerClasses.root}`]: { margin: "4px -4px" },
        }}
      >
        <MenuItem onClick={handleMinhaConta}>Minha conta</MenuItem>
        <MenuItem onClick={handleCriarNovaConta}>Criar nova conta</MenuItem>
        <Divider />
        <MenuItem
          onClick={handleSair}
          sx={{
            [`& .${listItemIconClasses.root}`]: { ml: "auto", minWidth: 0 },
          }}
        >
          <ListItemText>Sair</ListItemText>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      </Menu>

      <Dialog
      open={openAccountModal}
      onClose={() => setOpenAccountModal(false)}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 2,
          backgroundColor: "background.paper",
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        Minha Conta
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "action.hover",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Nome
            </Typography>
            <Typography variant="body1">{user?.name}</Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "action.hover",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">{user?.email}</Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "action.hover",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              NIF
            </Typography>
            <Typography variant="body1">{user?.nif}</Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "action.hover",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Função
            </Typography>
            <Typography variant="body1" sx={{ textTransform: "capitalize" }}>
              {user?.role}
            </Typography>
          </Paper>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", mt: 1 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAccountModal(false)}
          sx={{ borderRadius: 2, px: 4 }}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>

    </React.Fragment>
  );
}
