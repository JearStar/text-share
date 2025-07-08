// Primary colors
export const colors = {
  primary: {
    light: '#c4b5fd', // Light purple
    main: '#a78bfa', // Purple
    dark: '#7c3aed', // Dark purple
  },
  secondary: {
    light: '#f9a8d4', // Light pink
    main: '#f472b6', // Pink
    dark: '#db2777', // Dark pink
  },
  background: {
    default: '#0f172a', // Dark blue-gray
    paper: '#1e293b', // Lighter blue-gray
    glass: 'rgba(30, 41, 59, 0.7)',
  },
  text: {
    primary: '#f1f5f9', // Light gray
    secondary: '#94a3b8', // Muted gray
  },
  divider: 'rgba(148, 163, 184, 0.1)',
};

// Gradient definitions
export const gradients = {
  primary: 'linear-gradient(45deg, #a78bfa 30%, #f472b6 90%)',
  primaryHover: 'linear-gradient(45deg, #7c3aed 30%, #db2777 90%)',
  background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
  glassOverlay: 'linear-gradient(45deg, rgba(167, 139, 250, 0.05), rgba(244, 114, 182, 0.05))',
  glow: 'radial-gradient(circle at center, rgba(167, 139, 250, 0.1) 0%, transparent 50%)',
};

// Opacity values for different states
export const opacity = {
  hover: 0.8,
  disabled: 0.5,
  overlay: 0.7,
};

// Shadow definitions
export const shadows = {
  card: '0 0 40px rgba(0, 0, 0, 0.2)',
  button: '0 0 20px rgba(167, 139, 250, 0.3)',
  buttonHover: '0 0 25px rgba(167, 139, 250, 0.5)',
};
