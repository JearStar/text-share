import { alpha } from '@mui/material';

// Background styles
export const pageBackground = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '200vh',
    height: '200vh',
    background: 'radial-gradient(circle at center, rgba(167, 139, 250, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23a78bfa' fill-opacity='0.05'%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
    backgroundSize: '50px 50px',
    pointerEvents: 'none',
    opacity: 0.5,
  },
};

// Glassmorphism card styles
export const glassCard = {
  p: { xs: 3, sm: 6 },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'rgba(30, 41, 59, 0.7)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(148, 163, 184, 0.1)',
  boxShadow: '0 0 40px rgba(0, 0, 0, 0.2)',
  borderRadius: 3,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(167, 139, 250, 0.05), rgba(244, 114, 182, 0.05))',
    borderRadius: 'inherit',
  },
};

// Gradient text styles
export const gradientText = {
  fontWeight: 600,
  background: 'linear-gradient(45deg, #a78bfa 30%, #f472b6 90%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
};

// Input field styles
export const inputField = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: alpha('#1e293b', 0.4),
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
  '& .MuiInputLabel-root': {
    color: '#94a3b8',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#a78bfa',
  },
  '& .MuiInputBase-input': {
    color: '#f1f5f9',
  },
};

// Button styles
export const gradientButton = {
  background: 'linear-gradient(45deg, #a78bfa 30%, #f472b6 90%)',
  boxShadow: '0 0 20px rgba(167, 139, 250, 0.3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #7c3aed 30%, #db2777 90%)',
    boxShadow: '0 0 25px rgba(167, 139, 250, 0.5)',
  },
};

// Link styles
export const hoverLink = {
  color: '#94a3b8',
  textDecoration: 'none',
  '&:hover': {
    color: '#a78bfa',
    textDecoration: 'underline',
  },
};

// Icon button styles
export const iconButton = {
  color: '#94a3b8',
  '&:hover': {
    backgroundColor: 'rgba(167, 139, 250, 0.1)',
  },
};
