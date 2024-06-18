import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import MenuBar from '../menu-bar/MenuBarAdmin';
import { useNavigate } from 'react-router-dom';
import { LibraryClient } from '../api/library-client';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const libraryClient = new LibraryClient();

  const checkUserRole = async () => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const userRoleResponse = await libraryClient.getUserRole();
    if (userRoleResponse.statusCode === 200 && userRoleResponse.data) {
      const role = userRoleResponse.data;
      if (role !== 'ROLE_ADMIN') {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  };
  checkUserRole();

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
          {t('Welcome to the Library System')}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: '200px', height: '60px', fontSize: '18px' }}
            onClick={() => navigate('/addUserAdmin')}
          >
            {t('Add user')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: '200px', height: '60px', fontSize: '18px' }}
          >
            {t('Add book')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: '200px', height: '60px', fontSize: '18px' }}
          >
            {t('Add loan')}
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default HomePage;
