import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Avatar,
  Tooltip,
  Container,
  Badge,
  ListItemIcon,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: 'flex',
              fontWeight: 700,
              textDecoration: 'none',
              background: 'linear-gradient(45deg, #a78bfa 30%, #f472b6 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            TextShare
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', flexGrow: 1 }}>
            <Button
              component={RouterLink}
              to="/"
              startIcon={<DescriptionIcon />}
              sx={{
                ml: 2,
                color: '#f1f5f9',
                '&:hover': {
                  backgroundColor: 'rgba(167, 139, 250, 0.1)',
                },
              }}
            >
              Documents
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/editor')}
              sx={{
                ml: 2,
                background: 'linear-gradient(45deg, #a78bfa 30%, #f472b6 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #7c3aed 30%, #db2777 90%)',
                },
              }}
            >
              New Document
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Notifications">
              <IconButton
                size="large"
                sx={{
                  ml: 1,
                  color: '#f1f5f9',
                  '&:hover': {
                    backgroundColor: 'rgba(167, 139, 250, 0.1)',
                  },
                }}
              >
                <Badge
                  badgeContent={3}
                  sx={{
                    '& .MuiBadge-badge': {
                      background: 'linear-gradient(45deg, #a78bfa 30%, #f472b6 90%)',
                    },
                  }}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Account settings">
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                sx={{
                  ml: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(167, 139, 250, 0.1)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 35,
                    height: 35,
                    background: 'linear-gradient(45deg, #a78bfa 30%, #f472b6 90%)',
                  }}
                >
                  <PersonIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 180,
                borderRadius: 2,
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                '& .MuiMenuItem-root': {
                  color: '#f1f5f9',
                },
              },
            }}
          >
            <MenuItem
              component={RouterLink}
              to="/profile"
              onClick={handleClose}
              sx={{
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(167, 139, 250, 0.1)',
                },
              }}
            >
              <ListItemIcon>
                <PersonIcon sx={{ color: '#f1f5f9' }} />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem
              onClick={handleClose}
              sx={{
                py: 1.5,
                color: '#f472b6 !important',
                '&:hover': {
                  backgroundColor: 'rgba(244, 114, 182, 0.1)',
                },
              }}
            >
              <ListItemIcon>
                <LogoutIcon sx={{ color: '#f472b6' }} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;
