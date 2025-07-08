import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import Navigation from '../components/Navigation';

const Profile = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navigation />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Avatar sx={{ width: 100, height: 100, mb: 2 }}>
              <PersonIcon sx={{ fontSize: 60 }} />
            </Avatar>
            <Button variant="outlined" size="small">
              Change Avatar
            </Button>
          </Box>

          <Typography variant="h5" component="h1" gutterBottom>
            Profile Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="First Name" defaultValue="John" margin="normal" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Last Name" defaultValue="Doe" margin="normal" />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                defaultValue="john.doe@example.com"
                margin="normal"
                type="email"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, mb: 4 }}>
            <Button variant="contained" color="primary">
              Save Changes
            </Button>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" component="h2" gutterBottom>
            Change Password
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField fullWidth label="Current Password" type="password" margin="normal" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="New Password" type="password" margin="normal" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Confirm New Password" type="password" margin="normal" />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Button variant="contained" color="primary">
              Update Password
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;
