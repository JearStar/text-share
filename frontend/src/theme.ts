import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#a78bfa', // Purple
      light: '#c4b5fd',
      dark: '#7c3aed',
    },
    secondary: {
      main: '#f472b6', // Pink
      light: '#f9a8d4',
      dark: '#db2777',
    },
    background: {
      default: '#0f172a', // Dark blue-gray
      paper: '#1e293b',
    },
    error: {
      main: '#ef4444',
    },
    success: {
      main: '#10b981',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
    },
    divider: 'rgba(148, 163, 184, 0.1)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      background: 'linear-gradient(45deg, #a78bfa 30%, #f472b6 90%)',
      backgroundClip: 'text',
      textFillColor: 'transparent',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 500,
        },
        contained: {
          background: 'linear-gradient(45deg, #a78bfa 30%, #f472b6 90%)',
          boxShadow: '0 0 20px rgba(167, 139, 250, 0.3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #7c3aed 30%, #db2777 90%)',
            boxShadow: '0 0 25px rgba(167, 139, 250, 0.5)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            borderRadius: 'inherit',
            background:
              'linear-gradient(45deg, rgba(167, 139, 250, 0.05), rgba(244, 114, 182, 0.05))',
          },
        },
        elevation1: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
        },
        elevation2: {
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '& fieldset': {
              borderColor: 'rgba(148, 163, 184, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(167, 139, 250, 0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#a78bfa',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(167, 139, 250, 0.2)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(167, 139, 250, 0.1)',
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(148, 163, 184, 0.2)',
          '&.Mui-selected': {
            backgroundColor: 'rgba(167, 139, 250, 0.2)',
            color: '#a78bfa',
            '&:hover': {
              backgroundColor: 'rgba(167, 139, 250, 0.3)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(167, 139, 250, 0.1)',
          },
        },
      },
    },
  },
});

export default theme;
