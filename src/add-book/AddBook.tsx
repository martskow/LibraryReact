import React, { useState } from 'react';
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

const AddBookPage = () => {
  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    publishYear: '',
    availableCopies: '',
  });

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
      console.log('Book added successfully:', response.data);
    } else {
      console.error('Failed to add book:', response.statusCode);
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
    </div>
  );
};

export default AddBookPage;
