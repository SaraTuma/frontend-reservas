"use client";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuContent from './MenuContent';
import OptionsMenu from './OptionsMenu';
import { getUser } from '@/utils/token';
import Image from "next/image";
import { useEffect, useState } from 'react';
import Chip from '@mui/material/Chip';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const u = getUser();
    setUser(u);
  }, []);

  if (!mounted) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'PROVIDER':
        return 'primary';
      case 'CLIENT':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
        }}
      >
        <Box sx={{ display: { xs: 'flex' } }}>
          <Image
            src="/aoservices.png"
            alt="Logo"
            width={200}
            height={50}
            style={{ borderRadius: 12 }}
          />
        </Box>
      </Box>
      <Divider />
      <Box
      sx={{
          display: 'flex',
          justifyContent: 'center',
          p: 1,
        }}
      >
          {user?.role && (
            <Chip
              label={user.role}
              color={getRoleColor(user.role)}
              size="small"
              sx={{ mt: 0.5, fontWeight: 500 }}
            />
          )}
      </Box>
      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MenuContent />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sizes="small"
          alt={user?.name}
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: 'auto', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            {user?.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {user?.email}
          </Typography>
          
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
