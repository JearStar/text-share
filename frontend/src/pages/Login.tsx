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
import { loginUser } from '../api/auth';

const Login = () => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await loginUser(email, password);
      console.log('Login success', response.data);
    } catch (error: any) {
      if (error.response) {
        console.error('Login failed:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  return (
    <Box sx={pageBackground}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={glassCard}>
          <Typography component="h1" variant="h4" sx={{ mb: 4, ...gradientText }}>
            Welcome Back
          </Typography>
          <Box component="form" noValidate sx={formStyles.container} onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={inputField}
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
              autoComplete="current-password"
              sx={inputField}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {/* Disable button if email or password is empty */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                ...formStyles.submitButton,
                backgroundColor: (!email || !password) ? (theme.custom?.disabledButtonColor || '#888') : undefined,
                cursor: (!email || !password) ? 'not-allowed' : undefined
              }}
              disabled={!email || !password}
            >
              Sign In
            </Button>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <Link component={RouterLink} to="/forgot-password" variant="body2" sx={hoverLink}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: { sm: 'right' } }}>
                <Link component={RouterLink} to="/register" variant="body2" sx={hoverLink}>
                  Don&#39;t have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
