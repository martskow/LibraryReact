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
import { useEffect } from 'react';
import { LoanResponseDto } from '../api/dto/loan.dto';
import { QueueResponseDto } from '../api/dto/queue.dto';
import { StatsResponseDto } from '../api/dto/statistics.dto';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LibraryClient } from '../api/library-client';
import Cookies from 'js-cookie';
import RateReviewIcon from '@mui/icons-material/RateReview';
import Tooltip from '@mui/material/Tooltip';

function HomePageUser() {
  const apiClient = useApi();
  const [loans, setLoans] = React.useState<LoanResponseDto[]>([]);
  const [queues, setQueues] = React.useState<QueueResponseDto[]>([]);
  const [statistics, setStatistics] = React.useState<StatsResponseDto>({});
  const { t, i18n } = useTranslation();
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
      if (role !== 'ROLE_USER') {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  };
  checkUserRole();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await apiClient.getUserLoans();
        if (response.success && response.data) {
          setLoans(response.data);
          console.log(response.data);
        } else {
          console.error('Failed to fetch user loans');
        }
      } catch (error) {
        console.error('Error fetching user loans', error);
      }
      try {
        const response = await apiClient.getUserQueues();
        if (response.success && response.data) {
          setQueues(response.data);
          console.log(response.data);
        } else {
          console.error('Failed to fetch user queues');
        }
      } catch (error) {
        console.error('Error fetching user queues', error);
      }
      try {
        const response = await apiClient.getUserStats();
        if (response.success && response.data) {
          setStatistics(response.data);
          console.log(response.data);
        } else {
          console.error('Failed to fetch user statistics');
        }
      } catch (error) {
        console.error('Error fetching user statistics', error);
      }
    }

    fetchData();
  }, [apiClient]);

  const handleAddReview = (bookId: number) => {
    navigate(`/addReview?bookId=${bookId}`);
    console.log(bookId);
  };

  const handleDeleteQueue = async (queueId: number) => {
    try {
      const response = await apiClient.deleteQueue(queueId);
      if (response.success) {
        const updatedQueuesResponse = await apiClient.getUserQueues();
        if (updatedQueuesResponse.success && updatedQueuesResponse.data) {
          setQueues(updatedQueuesResponse.data);
        } else {
          console.error('Failed to fetch updated user queues');
        }
      } else {
        console.error('Failed to delete queue');
      }
    } catch (error) {
      console.error('Error deleting queue', error);
    }
  };

  return (
    <div>
      <MenuBar />
      <img className="image-banner" src="/books1.jpg" alt="Banner" />
      <div className="content">
        <div className="main-content">
          <div className="left-section">
            <div className="table-section">
              <h3>{t('statistics')}</h3>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 300 }} aria-label="statistics table">
                  <TableBody>
                    {Object.entries(statistics).map(([name, value], index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {t(name)}
                        </TableCell>
                        <TableCell>{value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
          <div className="right-section">
            <div className="table-section">
              <h3>{t('loans')}</h3>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="loans table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">{t('title')}</TableCell>
                      <TableCell align="center">{t('author')}</TableCell>
                      <TableCell align="center">{t('loan_date')}</TableCell>
                      <TableCell align="center">{t('due_date')}</TableCell>
                      <TableCell align="center">{t('add_review')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loans.map((loan, index) => (
                      <TableRow key={index}>
                        <TableCell align="center" component="th" scope="row">
                          {loan.book?.title}
                        </TableCell>
                        <TableCell align="center" component="th" scope="row">
                          {loan.book?.author}
                        </TableCell>
                        <TableCell align="center">{loan.loanDate}</TableCell>
                        <TableCell align="center">{loan.dueDate}</TableCell>
                        <TableCell align="center">
                          <Tooltip title={t('Add review')}>
                            <IconButton
                              onClick={() => {
                                if (loan.book?.id !== undefined) {
                                  handleAddReview(loan.book.id);
                                }
                              }}
                            >
                              <RateReviewIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div className="table-section">
              <h3>{t('queues')}</h3>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="queues table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">{t('title')}</TableCell>
                      <TableCell align="center">{t('author')}</TableCell>
                      <TableCell align="center">
                        {t('queue_start_date')}
                      </TableCell>
                      <TableCell align="center">{t('available')}</TableCell>
                      <TableCell align="center">{t('delete')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {queues.map((queue, index) => (
                      <TableRow key={index}>
                        <TableCell align="center" component="th" scope="row">
                          {queue.book?.title}
                        </TableCell>
                        <TableCell align="center" component="th" scope="row">
                          {queue.book?.author}
                        </TableCell>
                        <TableCell align="center">
                          {queue.queuingDate}
                        </TableCell>
                        <TableCell align="center">
                          {queue.book?.availableCopies === 0 ? 'False' : 'True'}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={() => {
                              if (queue.queueId !== undefined) {
                                handleDeleteQueue(queue.queueId);
                              }
                            }}
                          >
                            <RemoveIcon />
                          </IconButton>
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
