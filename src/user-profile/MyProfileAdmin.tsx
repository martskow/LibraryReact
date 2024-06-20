import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuBar from '../menu-bar/MenuBarAdmin';
import { LibraryClient } from '../api/library-client';
import { UserDto, UserResponseDto } from '../api/dto/user.dto';

interface AlertProps {
  message: string;
  severity: 'success' | 'error';
}

const MyProfilePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserResponseDto>({
    userId: undefined,
    userName: '',
    role: '',
    email: '',
    userFirstName: '',
    userLastName: '',
    userPassword: '',
  });
  const [alert, setAlert] = useState<AlertProps | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const libraryClient = new LibraryClient();
      const response = await libraryClient.getUserId();
      if (response.success && response.data) {
        const userResponse = await libraryClient.getUser(response.data);
        if (userResponse.success && userResponse.data) {
          setFormData(userResponse.data);
        } else {
          console.error('Failed to fetch user data');
        }
      } else {
        console.error('Failed to fetch user data');
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.error('Editing user data is not allowed');
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
            My Profile
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
            <Typography variant="body1" gutterBottom>
              Username: {formData.userName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Email: {formData.email}
            </Typography>
            <Typography variant="body1" gutterBottom>
              First Name: {formData.userFirstName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Last Name: {formData.userLastName}
            </Typography>
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

export default MyProfilePage;
