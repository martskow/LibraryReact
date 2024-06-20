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
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import { FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

const pages = ['Library', 'Blog', 'About us'];
const settings = ['Profile', 'Account', 'Settings', 'Logout'];

function ResponsiveAppBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

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

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleUserMenuItemClick = (setting: string) => {
    handleCloseUserMenu();
    if (setting === 'Logout') {
      navigate('/startPage');
    } else if (setting === 'Profile') {
      navigate('/profile');
    } else if (setting === 'Account') {
      navigate('/account');
    } else if (setting === 'Settings') {
      navigate('/settings');
    }
  };

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={() => navigate('/homeAdmin')}
            >
              <HomeIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            {pages.map((page) => (
              <Box key={page}>
                {page === 'Library' ? (
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
                      <MenuItem onClick={() => navigate('/loansAdmin')}>
                        {t('Loans')}
                      </MenuItem>
                      <MenuItem onClick={() => navigate('/booksListAdmin')}>
                        {t('Books')}
                      </MenuItem>
                      <MenuItem onClick={() => navigate('/users')}>
                        {t('Users')}
                      </MenuItem>
                    </Menu>
                  </FormControl>
                ) : (
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
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
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <Button
              onClick={() => changeLanguage('en')}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              EN
            </Button>
            <Typography sx={{ mx: 1, color: 'white' }}> | </Typography>
            <Button
              onClick={() => changeLanguage('pl')}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              PL
            </Button>
          </Box>
          <Box>
            <Tooltip title={t('Open settings')}>
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
