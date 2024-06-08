import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import MenuBar from '../menu-bar/MenuBarLibrarian';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <MenuBar />
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" sx={{ mb: 4 }}>
          Welcome to the Library System
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: '200px', height: '50px', fontSize: '18px' }}
            onClick={() => navigate('/addUserLibrarian')}
          >
            Add user
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: '200px', height: '50px', fontSize: '18px' }}
            onClick={() => navigate('/addBook')}
          >
            Add book
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: '200px', height: '50px', fontSize: '18px' }}
            onClick={() => navigate('/addLoan')}
          >
            Add loan
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default HomePage;
