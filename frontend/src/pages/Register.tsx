import React, { FormEvent, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Grid,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import {
  pageBackground,
  glassCard,
  gradientText,
  inputField,
  gradientButton,
  hoverLink,
  iconButton,
} from '../styles/common';
import { formStyles } from '../styles/components';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import api from '../api/axios';
import { signupUser } from '../api/auth';

const Register = () => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const isValidName = (name: string) => {
    return /^[A-Za-z' -]+$/.test(name.trim());
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const isValidPassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);
  };

  const passwordChecks = [
    {
      label: 'At least 8 characters',
      valid: password.length >= 8,
    },
    {
      label: 'One uppercase letter',
      valid: /[A-Z]/.test(password),
    },
    {
      label: 'One lowercase letter',
      valid: /[a-z]/.test(password),
    },
    {
      label: 'One number',
      valid: /\d/.test(password),
    },
    {
      label: 'One special character',
      valid: /[^A-Za-z\d]/.test(password),
    },
  ];

  const isFormValid =
    isValidName(name) &&
    isValidEmail(email) &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password === confirmPassword &&
    isValidPassword(password);

  // Error feedback for submit button
  const errorMessages: string[] = [];
  if ((touched.name || formTouched)) {
    if (!name.trim()) errorMessages.push('Name is required.');
    else if (!isValidName(name)) errorMessages.push('Name contains invalid characters.');
  }
  if ((touched.email || formTouched)) {
    if (!email.trim()) errorMessages.push('Email is required.');
    else if (!isValidEmail(email)) errorMessages.push('Invalid email address.');
  }
  if ((touched.password || formTouched)) {
    if (!password) errorMessages.push('Password is required.');
    else if (!isValidPassword(password)) errorMessages.push('Password does not meet requirements.');
  }
  if ((touched.confirmPassword || formTouched)) {
    if (!confirmPassword) errorMessages.push('Please confirm your password.');
    else if (password !== confirmPassword) errorMessages.push('Passwords do not match.');
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormTouched(true);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    try {
      const response = await signupUser(name, email, password);
      console.log('Login success', response.data);
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setErrorMessage(
          err.response.data?.error ||
          err.response.data?.message ||
          'Unexpected error occurred'
        );
      } else {
        setErrorMessage('Unexpected error occurred');
      }
    }
  };

  const shouldShowErrors = formTouched || Object.values(touched).some(Boolean);

  return (
    <Box sx={pageBackground}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={glassCard}>
          <Typography component="h1" variant="h4" sx={{ mb: 4, ...gradientText }}>
            Create Account
          </Typography>
          {errorMessage && (
            <Box sx={{ mb: 2, color: '#ef4444', fontSize: 16, textAlign: 'center' }}>{errorMessage}</Box>
          )}
          <Box component="form" noValidate sx={formStyles.container} onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              sx={inputField}
              onChange={(e) => { setName(e.target.value); setTouched(t => ({ ...t, name: true })); }}
              onBlur={() => setTouched(t => ({ ...t, name: true }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              sx={inputField}
              onChange={(e) => { setEmail(e.target.value); setTouched(t => ({ ...t, email: true })); }}
              onBlur={() => setTouched(t => ({ ...t, email: true }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              sx={inputField}
              onChange={(e) => { setPassword(e.target.value); setTouched(t => ({ ...t, password: true })); }}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => { setTouched(t => ({ ...t, password: true })); setPasswordFocused(false); }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={iconButton}
                      tabIndex={-1}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {(passwordFocused || password.length > 0) && (
              <Box sx={{ mb: 2, ml: 1 }}>
                {passwordChecks.map((check, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', color: check.valid ? '#10b981' : '#94a3b8', fontSize: 14, mb: 0.5 }}>
                    {check.valid ? (
                      <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
                    ) : (
                      <RadioButtonUncheckedIcon fontSize="small" sx={{ mr: 1 }} />
                    )}
                    {check.label}
                  </Box>
                ))}
              </Box>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              sx={inputField}
              onChange={(e) => { setConfirmPassword(e.target.value); setTouched(t => ({ ...t, confirmPassword: true })); }}
              onBlur={() => setTouched(t => ({ ...t, confirmPassword: true }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={iconButton}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                ...formStyles.submitButton,
                backgroundColor: !isFormValid ? (theme.custom?.disabledButtonColor || '#888') : undefined,
                cursor: !isFormValid ? 'not-allowed' : undefined
              }}
              disabled={!isFormValid}
              onClick={() => setFormTouched(true)}
            >
              Sign Up
            </Button>
            {(shouldShowErrors && errorMessages.length > 0) && (
              <Box sx={{ mt: 2, color: '#ef4444', fontSize: 14 }}>
                {errorMessages.map((msg, idx) => (
                  <div key={idx}>• {msg}</div>
                ))}
              </Box>
            )}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2" sx={hoverLink}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
