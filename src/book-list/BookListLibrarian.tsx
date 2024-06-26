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
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import AddBoxIcon from '@mui/icons-material/AddBox';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import './BookList.css';
import MenuBar from '../menu-bar/MenuBarLibrarian';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import { LibraryClient } from '../api/library-client';
import { BookResponseDto } from '../api/dto/book.dto';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import RemoveIcon from '@mui/icons-material/Remove';
import { useApi } from '../api/ApiProvider';
import { useTranslation } from 'react-i18next';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

interface Data {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  publishYear: string;
  availableCopies: number;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number,
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: 'title', numeric: false, disablePadding: true, label: 'title' },
  { id: 'author', numeric: false, disablePadding: false, label: 'author' },
  { id: 'isbn', numeric: false, disablePadding: false, label: 'isbn' },
  {
    id: 'publisher',
    numeric: false,
    disablePadding: false,
    label: 'publisher',
  },
  {
    id: 'publishYear',
    numeric: false,
    disablePadding: false,
    label: 'publishYear',
  },
  {
    id: 'availableCopies',
    numeric: true,
    disablePadding: false,
    label: 'availableCopies',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const { t } = useTranslation();

  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property as keyof Data);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell align="left">{t('title')}</TableCell>
        <TableCell align="left">{t('author')}</TableCell>
        <TableCell align="center">{t('isbn')}</TableCell>
        <TableCell align="left">{t('publisher')}</TableCell>
        <TableCell align="center">{t('publish_year')}</TableCell>
        <TableCell align="center">{t('available_copies')}</TableCell>
        <TableCell align="center">{t('lend')}</TableCell>
        <TableCell align="center">{t('delete')}</TableCell>
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;
  const { t } = useTranslation();

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity,
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        ></Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {t('translation:bookListTitle')}
        </Typography>
      )}
      {numSelected > 0 ? (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={t('translation:moreInformation')}>
            <IconButton>
              <ImportContactsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('translation:borrow')}>
            <IconButton onClick={() => {}}>
              <AddBoxIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ) : (
        <Tooltip title={t('translation:filterList')}>
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

const BookList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('author');
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [books, setBooks] = useState<BookResponseDto[]>([]);
  const apiClient = useApi();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deletingBookId, setDeletingBookId] = React.useState<number | null>(
    null,
  );

  useEffect(() => {
    const libraryClient = new LibraryClient();
    const fetchBooks = async () => {
      const response = await libraryClient.getBooks();
      if (response.success && response.data) {
        setBooks(response.data);
        console.log(response.data);
      } else {
        console.error(t('translation:failedToFetchBooks'));
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

    fetchBooks();
    checkUserRole();
  }, [navigate, t]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = [id];
    } else {
      newSelected = [];
    }

    setSelected(newSelected);
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

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - books.length) : 0;

  const visibleRows = React.useMemo(() => {
    const formattedBooks = books.map((book) => ({
      id: book.id || 0,
      title: book.title || '',
      author: book.author || '',
      isbn: book.isbn || '',
      publisher: book.publisher || '',
      publishYear: book.publishYear || '',
      availableCopies: book.availableCopies || 0,
    }));

    return stableSort(formattedBooks, getComparator(order, orderBy)).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  }, [books, order, orderBy, page, rowsPerPage]);

  const handleDeleteBook = async (bookId: number) => {
    try {
      const response = await apiClient.deleteBook(bookId);
      if (response.success) {
        const updatedBooksResponse = await apiClient.getBooks();
        if (updatedBooksResponse.success && updatedBooksResponse.data) {
          setBooks(updatedBooksResponse.data);
        } else {
          console.error(t('translation:failedToFetchUpdatedBooks'));
        }
      } else {
        console.error(t('translation:failedToDeleteBook'));
      }
    } catch (error) {
      console.error('Error deleting book', error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleBorrowBook = (isbn: string) => {
    navigate(`/addLoan?isbn=${isbn}`);
  };

  const handleOpenDeleteDialog = (bookId: number) => {
    setDeletingBookId(bookId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <div>
      <MenuBar />
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer className="Book-list">
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
              {
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={books.length}
                />
              }
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.title}
                      </TableCell>
                      <TableCell align="left">{row.author}</TableCell>
                      <TableCell align="center">{row.isbn}</TableCell>
                      <TableCell align="left">{row.publisher}</TableCell>
                      <TableCell align="center">{row.publishYear}</TableCell>
                      <TableCell align="center">
                        {row.availableCopies}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleBorrowBook(row.isbn)}>
                          <AddBoxIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => {
                            if (row.id !== undefined) {
                              handleOpenDeleteDialog(row.id);
                            }
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={books.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label={t('translation:densePadding')}
        />
      </Box>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t('Confirm Delete')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('Are you sure you want to delete this book?')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            {t('Cancel')}
          </Button>
          <Button
            onClick={() => handleDeleteBook(deletingBookId!)}
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

export default BookList;
