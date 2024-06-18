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
import MenuBar from '../menu-bar/MenuBarUser';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import { ClientResponse, LibraryClient } from '../api/library-client';
import { BookResponseDto } from '../api/dto/book.dto';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { QueueDto } from '../api/dto/queue.dto';
import { toast, ToastContainer } from 'react-toastify';
import { Alert, Snackbar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import RateReviewIcon from '@mui/icons-material/RateReview';
import AddReview from '../add-review/AddReview';

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
  { id: 'title', numeric: false, disablePadding: true, label: 'Title' },
  { id: 'author', numeric: false, disablePadding: false, label: 'Author' },
  { id: 'isbn', numeric: false, disablePadding: false, label: 'ISBN' },
  {
    id: 'publisher',
    numeric: false,
    disablePadding: false,
    label: 'Publisher',
  },
  {
    id: 'publishYear',
    numeric: false,
    disablePadding: false,
    label: 'Publish Year',
  },
  {
    id: 'availableCopies',
    numeric: true,
    disablePadding: false,
    label: 'Available Copies',
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

const libraryClient = new LibraryClient();

interface AlertProps {
  message: string;
  severity: 'success' | 'error';
}

const handleAddToQueue = async (
  selectedBookId: number,
  setAlert: React.Dispatch<React.SetStateAction<AlertProps | null>>,
) => {
  if (!selectedBookId) {
    return;
  }

  try {
    const response = await libraryClient.addToQueue(selectedBookId);
    if (response.success) {
      console.log('Book added to queue successfully');
      setAlert({
        message: 'Book added to queue successfully',
        severity: 'success',
      });
    } else {
      console.error('Failed to add book to queue', response.statusCode);
      setAlert({
        message: `Failed to add book to queue: ${response.statusCode}`,
        severity: 'error',
      });
    }
  } catch (error) {
    console.error('Error adding book to queue', error);
    setAlert({
      message: `Failed to add book to queue`,
      severity: 'error',
    });
  }
};

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property as keyof Data);
    };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const { t } = useTranslation();

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'center'}
            padding={'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {t(headCell.label)}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  selected: readonly number[];
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, selected } = props;
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const navigate = useNavigate();

  const { t } = useTranslation();
  /*const handleAddReview = (bookId: number) => {
    navigate(`/addReview?bookId=${bookId}`);
    console.log(bookId);
  };*/

  const handleGetReviews = (bookId: number) => {
    navigate(`/getReviews?bookId=${bookId}`);
    console.log(bookId);
  };

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
          {t('Book List')}
        </Typography>
      )}
      {numSelected > 0 ? (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={t('reviews')}>
            <IconButton onClick={() => handleGetReviews(selected[0])}>
              <ImportContactsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('Add to queue')}>
            <IconButton onClick={() => handleAddToQueue(selected[0], setAlert)}>
              <AddBoxIcon />
            </IconButton>
          </Tooltip>
          {/*<Tooltip title={t('Add review')}>
            <IconButton onClick={() => handleAddReview(selected[0])}>
              <RateReviewIcon />
            </IconButton>
          </Tooltip>*/}
          {alert && (
            <Snackbar
              open={!!alert}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              autoHideDuration={3000}
              onClose={() => setAlert(null)}
            >
              <Alert severity={alert.severity} onClose={() => setAlert(null)}>
                {alert.message}
              </Alert>
            </Snackbar>
          )}
        </Box>
      ) : (
        <Tooltip title={t('Filter list')}>
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

const BookList = () => {
  const navigate = useNavigate();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('author');
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [books, setBooks] = useState<BookResponseDto[]>([]);

  const { t } = useTranslation();

  useEffect(() => {
    const libraryClient = new LibraryClient();
    const fetchBooks = async () => {
      const response = await libraryClient.getBooks();
      if (response.success && response.data) {
        setBooks(response.data);
        console.log(response.data);
      } else {
        console.error('Failed to fetch books');
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
        if (role !== 'ROLE_USER') {
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    fetchBooks();
    checkUserRole();
  }, [navigate]);

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

  // Avoid a layout jump when reaching the last page with empty rows.
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

  return (
    <div>
      <MenuBar />
      <ToastContainer />
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            selected={selected}
          />
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
          label={t('Dense padding')}
        />
      </Box>
    </div>
  );
};

export default BookList;
