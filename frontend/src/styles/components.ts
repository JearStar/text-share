import { colors, gradients, shadows } from './colors';

// Navigation styles
export const navigationStyles = {
  appBar: {
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderBottom: `1px solid ${colors.divider}`,
  },
  logo: {
    fontWeight: 700,
    textDecoration: 'none',
    background: gradients.primary,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
};

// Editor styles
export const editorStyles = {
  toolbar: {
    backgroundColor: colors.background.glass,
    backdropFilter: 'blur(10px)',
    borderBottom: `1px solid ${colors.divider}`,
  },
  content: {
    minHeight: 'calc(100vh - 200px)',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(16px)',
    border: `1px solid ${colors.divider}`,
    boxShadow: shadows.card,
  },
};

// Card styles
export const cardStyles = {
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
    backgroundColor: colors.background.glass,
    backdropFilter: 'blur(10px)',
    border: `1px solid ${colors.divider}`,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: shadows.buttonHover,
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  title: {
    color: colors.text.primary,
    fontWeight: 500,
  },
};

// Form styles
export const formStyles = {
  container: {
    width: '100%',
    position: 'relative',
    zIndex: 1,
  },
  submitButton: {
    height: '48px',
    marginTop: 3,
    marginBottom: 2,
    background: gradients.primary,
    boxShadow: shadows.button,
    '&:hover': {
      background: gradients.primaryHover,
      boxShadow: shadows.buttonHover,
    },
  },
};

// Dialog styles
export const dialogStyles = {
  paper: {
    backgroundColor: colors.background.paper,
    backdropFilter: 'blur(20px)',
    border: `1px solid ${colors.divider}`,
    boxShadow: shadows.card,
  },
  title: {
    color: colors.text.primary,
    background: gradients.primary,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
};
