import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleClose();
          },
          sx: { backgroundImage: 'none' },
        },
      }}
    >
      <DialogTitle>Redifinir a senha</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          Didite o seu E-mail / NIF para recuperar a sua senha.
        </DialogContentText>
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          label="E-mail / NIF"
          placeholder="E-mail / NIF"
          type="email"
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="submit">
          Continuar
        </Button>
      </DialogActions>
    </Dialog>
  );
}