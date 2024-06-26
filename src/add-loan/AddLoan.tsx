import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import MenuBar from '../menu-bar/MenuBarLibrarian';
import { LibraryClient } from '../api/library-client';
import { useLocation } from 'react-router-dom';

const AddLoanPage = () => {
  const [formData, setFormData] = useState({
    userName: '',
    isbn: '',
  });

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isbn = params.get('isbn');
    if (isbn) {
      setFormData((prevData) => ({
        ...prevData,
        isbn,
      }));
    }
  }, [location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const libraryClient = new LibraryClient();
    const loanData = {
      user: {
        userName: formData.userName,
      },
      book: {
        isbn: formData.isbn,
      },
    };
    const response = await libraryClient.addLoan(loanData);
    if (response.success) {
      console.log('Loan added successfully:', response.data);
      setFormData({
        isbn: '',
        userName: '',
      });
    } else {
      console.error('Failed to add loan:', response.statusCode);
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
            Add New Loan
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
              label="Book isbn"
              name="isbn"
              value={formData.isbn}
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
    </div>
  );
};

export default AddLoanPage;
