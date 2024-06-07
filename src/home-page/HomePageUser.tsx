import * as React from 'react';
import MenuBar from '../menu-bar/MenuBarUser';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import './HomePage.css';
import { useApi } from '../api/ApiProvider';

// Mock data
const user = 'John Doe';

const loans = [
  { title: 'Book A', loanDate: '2023-01-10', dueDate: '2023-01-20' },
  { title: 'Book B', loanDate: '2023-02-15', dueDate: '2023-02-25' },
];

const queues = [
  { title: 'Book C', queueStartDate: '2023-03-01', available: true },
  { title: 'Book D', queueStartDate: '2023-04-10', available: false },
  { title: 'Book E', queueStartDate: '2023-05-10', available: true },
];

const statistics = [
  { name: 'Borrowed books', value: 10 },
  { name: 'Reviews posted', value: 5 },
  { name: 'Now Reading', value: 2 },
  { name: 'In queue', value: 3 },
];

function HomePageUser() {
  const apiClient = useApi();

  apiClient.getBooks().then((response) => {
    console.log(response);
  });

  return (
    <div>
      <MenuBar />
      <img className="image-banner" src="/books1.jpg" alt="Banner" />
      <div className="content">
        <h2>Welcome {user}!</h2>
        <div className="main-content">
          <div className="left-section">
            <div className="table-section">
              <h3>Statistics</h3>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 300 }} aria-label="statistics table">
                  <TableBody>
                    {statistics.map((stat, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {stat.name}
                        </TableCell>
                        <TableCell>{stat.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
          <div className="right-section">
            <div className="table-section">
              <h3>Loans</h3>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="loans table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Loan date</TableCell>
                      <TableCell>Due Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loans.map((loan, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {loan.title}
                        </TableCell>
                        <TableCell>{loan.loanDate}</TableCell>
                        <TableCell>{loan.dueDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div className="table-section">
              <h3>Queues</h3>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="queues table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Queue start date</TableCell>
                      <TableCell>Available</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {queues.map((queue, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {queue.title}
                        </TableCell>
                        <TableCell>{queue.queueStartDate}</TableCell>
                        <TableCell>
                          {queue.available ? 'True' : 'False'}
                        </TableCell>
                        <TableCell>
                          {queue.available && (
                            <Button variant="contained">Borrow</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePageUser;
