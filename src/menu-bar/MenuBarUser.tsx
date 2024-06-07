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

const pages = ['Library', 'Blog', 'About us'];
const settings = ['Profile', 'Account', 'Settings', 'Logout'];

function ResponsiveAppBar() {
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
              onClick={() => navigate('/home')}
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
                      {page}
                    </Button>
                    <Menu
                      id="library-menu"
                      anchorEl={anchorElNav}
                      keepMounted
                      open={Boolean(anchorElNav)}
                      onClose={handleCloseNavMenu}
                    >
                      <MenuItem onClick={() => navigate('/borrow')}>
                        Borrow
                      </MenuItem>
                      <MenuItem onClick={() => navigate('/booksList')}>
                        Books
                      </MenuItem>
                      <MenuItem onClick={() => navigate('/reviews')}>
                        Reviews
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
                    {page}
                  </Button>
                )}
              </Box>
            ))}
          </Box>
          <Box>
            <Tooltip title="Open settings">
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
                  <Typography textAlign="center">{setting}</Typography>
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
