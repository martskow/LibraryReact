import React, { useEffect, useState } from 'react';
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
import { useParams, useNavigate } from 'react-router-dom';
import MenuBar from '../menu-bar/MenuBarLibrarian';
import { LibraryClient } from '../api/library-client';
import { UserDto, UserResponseDto } from '../api/dto/user.dto';

interface AlertProps {
  message: string;
  severity: 'success' | 'error';
}

const EditUserPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserDto>({
    userName: '',
    role: '',
    email: '',
    userFirstName: '',
    userLastName: '',
  });
  const [alert, setAlert] = useState<AlertProps | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const libraryClient = new LibraryClient();
        const response = await libraryClient.getUser(parseInt(userId, 10));
        if (response.success && response.data) {
          setFormData(response.data);
        } else {
          console.error('Failed to fetch user data');
        }
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userId) {
      const libraryClient = new LibraryClient();
      const response = await libraryClient.updateUser(
        parseInt(userId, 10),
        formData,
      );
      console.log(userId, formData);
      if (response.success) {
        setAlert({
          message: 'User updated successfully!',
          severity: 'success',
        });
        console.log('User updated successfully:', response.data);
      } else {
        setAlert({
          message: `Failed to update user: ${response.statusCode}`,
          severity: 'error',
        });
        console.error('Failed to update user:', response.statusCode);
      }
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
            Edit User
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

export default EditUserPage;
