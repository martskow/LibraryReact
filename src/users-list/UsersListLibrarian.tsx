import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import MenuBar from '../menu-bar/MenuBarLibrarian';
import { LibraryClient } from '../api/library-client';
import { UserResponseDto } from '../api/dto/user.dto';
import { LoanResponseDto } from '../api/dto/loan.dto'; // Import dla pożyczek
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../api/ApiProvider';
import { useTranslation } from 'react-i18next';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import './UsersList.css';
import EditIcon from '@mui/icons-material/Edit';

const UserList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dense, setDense] = useState(false);
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [userLoans, setUserLoans] = useState<LoanResponseDto[]>([]); // Nowy stan dla pożyczek użytkownika
  const apiClient = useApi();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const libraryClient = new LibraryClient();

  useEffect(() => {
    const libraryClient = new LibraryClient();
    const fetchUsers = async () => {
      const response = await libraryClient.getUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        console.error(t('Failed to fetch users'));
      }
    };
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

    fetchUsers();
    checkUserRole();
  }, [navigate, t]);

  const handleClick = async (
    event: React.MouseEvent<unknown>,
    userId: number | undefined,
  ) => {
    if (userId !== null && userId !== undefined) {
      try {
        const response = await libraryClient.getUserLoansByLibrarian(userId);
        if (response.success && response.data) {
          setSelected(userId);
          setUserLoans(response.data);
        } else {
          console.error(t('Failed to fetch user loans'));
        }
      } catch (error) {
        console.error('Error fetching user loans', error);
      }
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (userId: number | undefined) => selected === userId;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const visibleUsers = React.useMemo(() => {
    return users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [users, page, rowsPerPage]);

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await apiClient.deleteUser(userId);
      if (response.success) {
        const updatedUsersResponse = await apiClient.getUsers();
        if (updatedUsersResponse.success && updatedUsersResponse.data) {
          setUsers(updatedUsersResponse.data);
        } else {
          console.error(t('Failed to fetch updated users'));
        }
      } else {
        console.error(t('Failed to delete user'));
      }
    } catch (error) {
      console.error('Error deleting user', error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleOpenDeleteDialog = (userId: number) => {
    setDeletingUserId(userId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleEditClick = (userId: number | undefined) => {
    if (userId !== null && userId !== undefined) {
      navigate(`/editUser/${userId}`);
    }
  };

  return (
    <div>
      <MenuBar />
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <TableContainer className="User-list">
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center">{t('User ID')}</TableCell>
                  <TableCell align="left">{t('Username')}</TableCell>
                  <TableCell align="left">{t('Email')}</TableCell>
                  <TableCell align="center">{t('First Name')}</TableCell>
                  <TableCell align="center">{t('Last Name')}</TableCell>
                  <TableCell align="center">{t('Edit')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleUsers.map((user, index) => (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, user.userId)}
                    role="checkbox"
                    aria-checked={isSelected(user.userId)}
                    tabIndex={-1}
                    key={user.userId}
                    selected={isSelected(user.userId)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell align="center">{user.userId}</TableCell>
                    <TableCell align="left">{user.userName}</TableCell>
                    <TableCell align="left">{user.email}</TableCell>
                    <TableCell align="center">{user.userFirstName}</TableCell>
                    <TableCell align="center">{user.userLastName}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={(event) => {
                          event.stopPropagation();
                          handleEditClick(user.userId);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={5} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label={t('Dense padding')}
        />
      </Box>
      {selected !== null && (
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            {t('Loans of selected user')}
          </Typography>
          <Paper>
            <TableContainer sx={{ width: '80%', margin: '0 auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">{t('Loan ID')}</TableCell>
                    <TableCell align="center">{t('Title')}</TableCell>
                    <TableCell align="center">{t('Loan date')}</TableCell>
                    <TableCell align="center">{t('Due Date')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userLoans.map((loan) => (
                    <TableRow key={loan.loanId}>
                      <TableCell align="center">{loan.loanId}</TableCell>
                      <TableCell align="center">{loan.book?.title}</TableCell>
                      <TableCell align="center">{loan.loanDate}</TableCell>
                      <TableCell align="center">{loan.dueDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t('Confirm Delete')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('Are you sure you want to delete this user?')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            {t('Cancel')}
          </Button>
          <Button
            onClick={() => handleDeleteUser(deletingUserId!)}
            color="primary"
            autoFocus
          >
            {t('Delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserList;
