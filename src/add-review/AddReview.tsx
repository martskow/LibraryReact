import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import MenuBar from '../menu-bar/MenuBarUser';
import { LibraryClient } from '../api/library-client';
import { useLocation } from 'react-router-dom';

const AddReviewPage = () => {
  const [formData, setFormData] = useState({
    userId: '',
    id: '',
    rating: '',
    comment: '',
  });

  const location = useLocation();

  useEffect(() => {
    const fetchUserId = async () => {
      const libraryClient = new LibraryClient();
      const userIdResponse = await libraryClient.getUserId();
      if (userIdResponse.statusCode === 200 && userIdResponse.data) {
        setFormData((prevData) => ({
          ...prevData,
          userId: userIdResponse.data,
        }));
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('bookId');
    if (id) {
      setFormData((prevData) => ({
        ...prevData,
        id,
      }));
    }
  }, [location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const libraryClient = new LibraryClient();
    const reviewData = {
      user: {
        userId: formData.userId,
      },
      book: {
        id: formData.id,
      },
      rating: parseInt(formData.rating, 10),
      comment: formData.comment,
    };

    const response = await libraryClient.addReview(reviewData);
    console.log(reviewData);
    if (response.success) {
      console.log('Review added successfully:', response.data);
      setFormData({
        userId: formData.userId,
        id: formData.id,
        rating: '',
        comment: '',
      });
    } else {
      console.error('Failed to add review:', response.statusCode);
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
            Add New Review
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
              label="Book ID"
              name="id"
              value={formData.id}
              onChange={handleChange}
              disabled={true}
              fullWidth
            />
            <TextField
              label="Rating"
              name="rating"
              type="number"
              value={formData.rating}
              onChange={handleChange}
              fullWidth
              inputProps={{
                min: 1,
                max: 10,
              }}
            />
            <TextField
              label="Comment"
              name="comment"
              multiline
              rows={4}
              value={formData.comment}
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

export default AddReviewPage;
