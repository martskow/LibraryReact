import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const pages = ['library', 'blog', 'about_us'];
const settings = ['profile', 'account', 'settings', 'logout'];

function ResponsiveAppBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );
  const [libraryMenuOpen, setLibraryMenuOpen] = React.useState(false);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLibraryMenuOpen = () => {
    setLibraryMenuOpen(true);
  };

  const handleLibraryMenuClose = () => {
    setLibraryMenuOpen(false);
  };

  const handleUserMenuItemClick = (setting: string) => {
    handleCloseUserMenu();
    if (setting === 'logout') {
      navigate('/startPage');
    } else if (setting === 'profile') {
      navigate('/profile');
    } else if (setting === 'account') {
      navigate('/account');
    } else if (setting === 'settings') {
      navigate('/settings');
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label={t('home')}
              sx={{ mr: 2 }}
              onClick={() => navigate('/home')}
            >
              <HomeIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            {pages.map((page) => (
              <Box key={page}>
                {page === 'library' ? (
                  <FormControl>
                    <Button
                      sx={{
                        my: 2,
                        color: 'white',
                        display: { xs: 'none', md: 'block' },
                      }}
                      onClick={handleOpenNavMenu}
                    >
                      {t(page)}
                    </Button>
                    <Menu
                      id="library-menu"
                      anchorEl={anchorElNav}
                      keepMounted
                      open={Boolean(anchorElNav)}
                      onClose={handleCloseNavMenu}
                    >
                      <MenuItem onClick={() => navigate('/borrow')}>
                        {t('borrow')}
                      </MenuItem>
                      <MenuItem onClick={() => navigate('/booksList')}>
                        {t('books')}
                      </MenuItem>
                      <MenuItem onClick={() => navigate('/reviews')}>
                        {t('reviews')}
                      </MenuItem>
                    </Menu>
                  </FormControl>
                ) : (
                  <Button
                    key={page}
                    onClick={() =>
                      navigate(`/${page.toLowerCase().replace(' ', '')}`)
                    }
                    sx={{
                      my: 2,
                      color: 'white',
                      display: { xs: 'none', md: 'block' },
                    }}
                  >
                    {t(page)}
                  </Button>
                )}
              </Box>
            ))}
          </Box>
          <Box>
            <Tooltip title={t('open_settings')}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleUserMenuItemClick(setting)}
                >
                  <Typography textAlign="center">{t(setting)}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
