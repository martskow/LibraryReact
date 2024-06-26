import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import MenuBar from '../menu-bar/MenuBarLibrarian';
import axios from 'axios';
import { LibraryClient } from '../api/library-client';

interface AlertProps {
  message: string;
  severity: 'success' | 'error';
}

const AddUserPage = () => {
  const [formData, setFormData] = useState({
    userName: '',
    userPassword: '',
    role: 'ROLE_USER',
    email: '',
    userFirstName: '',
    userLastName: '',
  });

  const [alert, setAlert] = useState<AlertProps | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const libraryClient = new LibraryClient();
    const response = await libraryClient.addUser(formData);
    if (response.success) {
      setAlert({ message: 'User added successfully!', severity: 'success' });
      console.log('User added successfully:', response.data);
      setFormData({
        userName: '',
        userPassword: '',
        role: 'ROLE_USER',
        email: '',
        userFirstName: '',
        userLastName: '',
      });
    } else {
      setAlert({
        message: `Failed to add user: ${response.statusCode}`,
        severity: 'error',
      });
      console.error('Failed to add user:', response.statusCode);
    }
  };

  return (
    <div>
      <MenuBar />
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          paddingTop: 4,
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 600 }}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Add New User
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <TextField
              label="Username"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Password"
              name="userPassword"
              type="password"
              value={formData.userPassword}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="First Name"
              name="userFirstName"
              value={formData.userFirstName}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Last Name"
              name="userLastName"
              value={formData.userLastName}
              onChange={handleChange}
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Paper>
      </Container>
      {alert && (
        <Snackbar
          open={!!alert}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          autoHideDuration={3000}
          onClose={() => setAlert(null)}
        >
          <Alert severity={alert.severity} onClose={() => setAlert(null)}>
            {alert.message}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
};

export default AddUserPage;
