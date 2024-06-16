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
import './LoansList.css';
import MenuBar from '../menu-bar/MenuBarLibrarian';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import { useEffect, useState } from 'react';
import { BookResponseDto } from '../api/dto/book.dto';
import { LibraryClient } from '../api/library-client';
import { LoanResponseDto } from '../api/dto/loan.dto';
import { UserResponseDto } from '../api/dto/user.dto';
import { useApi } from '../api/ApiProvider';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import { Alert, Snackbar } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface Data {
  id: number;
  userName: string;
  title: string;
  isbn: string;
  loanDate: string;
  dueDate: string;
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
  { id: 'id', numeric: true, disablePadding: true, label: 'Loan ID' },
  { id: 'userName', numeric: false, disablePadding: false, label: 'Username' },
  { id: 'title', numeric: false, disablePadding: false, label: 'Title' },
  { id: 'isbn', numeric: false, disablePadding: false, label: 'Isbn' },
  {
    id: 'loanDate',
    numeric: false,
    disablePadding: false,
    label: 'Loan Date',
  },
  {
    id: 'dueDate',
    numeric: false,
    disablePadding: false,
    label: 'Due Date',
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

const handleExtendLoan = async (
  selectedLoanId: number,
  setAlert: React.Dispatch<React.SetStateAction<AlertProps | null>>,
) => {
  if (!selectedLoanId) {
    return;
  }
  try {
    const response = await libraryClient.extendLoan(selectedLoanId);
    if (response.success) {
      console.log('Loan due date extended successfully');
      setAlert({
        message: 'Loan due date extended successfully',
        severity: 'success',
      });
    } else {
      console.error('Failed to extend loan due date', response.statusCode);
      setAlert({
        message: `Failed to extend loan due date: ${response.statusCode}`,
        severity: 'error',
      });
    }
  } catch (error) {
    console.error('Error extending loan due date', error);
    setAlert({
      message: `Error extending loan due date`,
      severity: 'error',
    });
  }
};

const handleReturnLoan = async (
  selectedLoanId: number,
  setAlert: React.Dispatch<React.SetStateAction<AlertProps | null>>,
) => {
  if (!selectedLoanId) {
    return;
  }

  try {
    const response = await libraryClient.returnLoan(selectedLoanId);
    if (response.success) {
      console.log('Loan has been returned successfully');
      setAlert({
        message: 'Loan has been returned successfully',
        severity: 'success',
      });
    } else {
      console.error('Failed to return loan', response.statusCode);
      setAlert({
        message: `Failed to return loan: ${response.statusCode}`,
        severity: 'error',
      });
    }
  } catch (error) {
    console.error('Error returning loan', error);
    setAlert({
      message: `Error returning loan`,
      severity: 'error',
    });
  }
};

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

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
              {headCell.label}
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
        >
          // ew napis na pasku
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Loan List
        </Typography>
      )}
      {numSelected > 0 ? (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Extend Loan">
            <IconButton onClick={() => handleExtendLoan(selected[0], setAlert)}>
              <MoreTimeIcon />
            </IconButton>
          </Tooltip>
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
          <Tooltip title="Return">
            <IconButton onClick={() => handleReturnLoan(selected[0], setAlert)}>
              <RemoveIcon />
            </IconButton>
          </Tooltip>
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
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
const LoansList = () => {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('id');
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loans, setLoans] = useState<LoanResponseDto[]>([]);
  const apiClient = useApi();
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
      if (role !== 'ROLE_LIBRARIAN') {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  };
  checkUserRole();

  useEffect(() => {
    const libraryClient = new LibraryClient();
    const fetchLoans = async () => {
      const response = await libraryClient.getLoans();
      if (response.success && response.data) {
        setLoans(response.data);
        console.log(response.data);
      } else {
        console.error('Failed to fetch books');
      }
    };

    fetchLoans();
  }, []);

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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - loans.length) : 0;

  const visibleRows = React.useMemo(() => {
    return stableSort(
      loans.map((loan) => ({
        id: loan.loanId || 0,
        userName: loan.user?.userName || '',
        title: loan.book?.title || '',
        isbn: loan.book?.isbn || '',
        loanDate: loan.loanDate || '',
        dueDate: loan.dueDate || '',
      })),
      getComparator(order, orderBy),
    ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [loans, order, orderBy, page, rowsPerPage]);

  return (
    <div>
      <MenuBar />
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            selected={selected}
          />
          <TableContainer className="Loan-list">
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={loans.length}
              />
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
                      {/*<TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="center"
                      >
                        {row.id}
                      </TableCell>*/}
                      <TableCell align="center">{row.id}</TableCell>
                      <TableCell align="center">{row.userName}</TableCell>
                      <TableCell align="center">{row.title}</TableCell>
                      <TableCell align="center">{row.isbn}</TableCell>
                      <TableCell align="center">{row.loanDate}</TableCell>
                      <TableCell align="center">{row.dueDate}</TableCell>
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
            count={loans.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
      </Box>
    </div>
  );
};
export default LoansList;
