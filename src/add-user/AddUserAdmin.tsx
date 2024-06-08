import React from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import MenuBar from '../menu-bar/MenuBarAdmin';
import { LibraryClient } from '../api/library-client';

const AddUserPage = () => {
  const [formData, setFormData] = React.useState({
    userName: '',
    userPassword: '',
    role: '',
    email: '',
    userFirstName: '',
    userLastName: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  const handleChangeRole = (e: SelectChangeEvent<string>) => {
    const value = e.target.value as string;
    setFormData({
      ...formData,
      role: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const libraryClient = new LibraryClient();
    const response = await libraryClient.addUser(formData);
    if (response.success) {
      console.log('User added successfully:', response.data);
    } else {
      console.error('Failed to add user:', response.statusCode);
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
            Add New User
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
              label="Password"
              name="userPassword"
              type="password"
              value={formData.userPassword}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="First Name"
              name="userFirstName"
              value={formData.userFirstName}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Last Name"
              name="userLastName"
              value={formData.userLastName}
              onChange={handleChange}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={formData.role}
                onChange={handleChangeRole}
                label="Role"
              >
                <MenuItem value="ROLE_USER">Reader</MenuItem>
                <MenuItem value="ROLE_LIBRARIAN">Librarian</MenuItem>
                <MenuItem value="ROLE_ADMIN">Administrator</MenuItem>
              </Select>
            </FormControl>
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

export default AddUserPage;
