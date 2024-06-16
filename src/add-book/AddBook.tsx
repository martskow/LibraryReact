import React, { useState, useEffect } from 'react';
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
import { LibraryClient } from '../api/library-client';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

interface AlertProps {
  message: string;
  severity: 'success' | 'error';
}

const AddBookPage = () => {
  const libraryClient = new LibraryClient();
  const navigate = useNavigate();

  const checkUserRole = async () => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const userRoleResponse = await libraryClient.getUserRole();
    if (userRoleResponse.statusCode === 200 && userRoleResponse.data) {
      const role = userRoleResponse.data;
      if (role !== 'ROLE_LIBRARIAN') {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  };
  checkUserRole();

  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    publishYear: '',
    availableCopies: '',
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
    const response = await libraryClient.addBook(formData);
    if (response.success) {
      setAlert({ message: 'Book added successfully!', severity: 'success' });
      setFormData({
        isbn: '',
        title: '',
        author: '',
        publisher: '',
        publishYear: '',
        availableCopies: '',
      });
    } else {
      setAlert({
        message: `Failed to add book: ${response.statusCode}`,
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

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
            Add New Book
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
              label="ISBN"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Publisher"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Publish Year"
              name="publishYear"
              value={formData.publishYear}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Available Copies"
              name="availableCopies"
              value={formData.availableCopies}
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

export default AddBookPage;
