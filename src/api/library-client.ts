import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { BookResponseDto } from './dto/book.dto';
import { LoanDto, LoanExtendDto, LoanResponseDto } from './dto/loan.dto';
import { QueueDto, QueueResponseDto } from './dto/queue.dto';
import { StatsResponseDto } from './dto/statistics.dto';
import { LoanArchiveResponseDto } from './dto/archiveLoan.dto';
import { ReviewResponseDto } from './dto/review.dto';
import { UserDto, UserResponseDto } from './dto/user.dto';

export type ClientResponse<T> = {
  success: boolean;
  data: T;
  statusCode: number;
};

export class LibraryClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:8081',
    });

    const token = Cookies.get('token');
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  public async login(data: LoginDto): Promise<ClientResponse<string | null>> {
    try {
      const response: AxiosResponse<string> = await this.client.post(
        '/login',
        data,
      );

      console.log('Response Data:', response.data);

      const token = response.data;
      if (token) {
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        Cookies.set('token', token);
      }

      return {
        success: true,
        data: token,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getBooks(): Promise<ClientResponse<BookResponseDto[] | null>> {
    try {
      const token = Cookies.get('token');
      if (token) {
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        const response: AxiosResponse<BookResponseDto[]> =
          await this.client.get('/book/getAll');

        return {
          success: true,
          data: response.data,
          statusCode: response.status,
        };
      } else {
        console.error('Token not found');

        return {
          success: false,
          data: null,
          statusCode: 401,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getLoans(): Promise<ClientResponse<LoanResponseDto[] | null>> {
    try {
      const token = Cookies.get('token');
      if (token) {
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        const response: AxiosResponse<LoanResponseDto[]> =
          await this.client.get('/loan/getAll');

        return {
          success: true,
          data: response.data,
          statusCode: response.status,
        };
      } else {
        console.error('Token not found');

        return {
          success: false,
          data: null,
          statusCode: 401,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getArchiveLoans(): Promise<
    ClientResponse<LoanArchiveResponseDto[] | null>
  > {
    try {
      const token = Cookies.get('token');
      if (token) {
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        const response: AxiosResponse<LoanArchiveResponseDto[]> =
          await this.client.get('/loanArchive/getAll');

        return {
          success: true,
          data: response.data,
          statusCode: response.status,
        };
      } else {
        console.error('Token not found');

        return {
          success: false,
          data: null,
          statusCode: 401,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getUserLoansByLibrarian(
    userId: number,
  ): Promise<ClientResponse<LoanResponseDto[] | null>> {
    try {
      const token = Cookies.get('token');
      if (token) {
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        const response: AxiosResponse<LoanResponseDto[]> =
          await this.client.get(`/loan/getAllUserLoans/${userId}`);

        return {
          success: true,
          data: response.data,
          statusCode: response.status,
        };
      } else {
        console.error('Token not found');

        return {
          success: false,
          data: null,
          statusCode: 401,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getUserLoans(): Promise<
    ClientResponse<LoanResponseDto[] | null>
  > {
    try {
      const token = Cookies.get('token');
      if (token) {
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        const userId: AxiosResponse<any> =
          await this.client.get('/user/getUserId');
        const response: AxiosResponse<LoanResponseDto[]> =
          await this.client.get(`/loan/getAllUserLoans/${userId.data}`);

        return {
          success: true,
          data: response.data,
          statusCode: response.status,
        };
      } else {
        console.error('Token not found');

        return {
          success: false,
          data: null,
          statusCode: 401,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async addUser(userData: any): Promise<ClientResponse<any>> {
    try {
      const token = Cookies.get('token');
      if (token) {
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        const response: AxiosResponse<any> = await this.client.post(
          '/user/add',
          userData,
        );

        return {
          success: true,
          data: response.data,
          statusCode: response.status,
        };
      } else {
        console.error('Token not found');

        return {
          success: false,
          data: null,
          statusCode: 401,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async addBook(bookData: any): Promise<ClientResponse<any>> {
    try {
      const token = Cookies.get('token');
      if (token) {
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        const response: AxiosResponse<any> = await this.client.post(
          '/book/add',
          bookData,
        );

        return {
          success: true,
          data: response.data,
          statusCode: response.status,
        };
      } else {
        console.error('Token not found');

        return {
          success: false,
          data: null,
          statusCode: 401,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async deleteBook(bookId: number): Promise<ClientResponse<null>> {
    try {
      const token = Cookies.get('token');
      if (token) {
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        const response: AxiosResponse<null> = await this.client.delete(
          `/book/delete/${bookId}`,
        );

        return {
          success: true,
          data: response.data,
          statusCode: response.status,
        };
      } else {
        console.error('Token not found');

        return {
          success: false,
          data: null,
          statusCode: 401,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async addLoan(loanData: LoanDto): Promise<ClientResponse<any>> {
    try {
      const token = Cookies.get('token');
      if (token) {
        console.log(loanData);
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        const response: AxiosResponse<any> = await this.client.post(
          '/loan/add',
          loanData,
        );

        return {
          success: true,
          data: response.data,
          statusCode: response.status,
        };
      } else {
        console.error('Token not found');
        return {
          success: false,
          data: null,
          statusCode: 401,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async deleteLoan(loanId: number): Promise<ClientResponse<null>> {
    try {
      const token = Cookies.get('token');
      if (token) {
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        const response: AxiosResponse<null> = await this.client.delete(
          `/loan/delete/${loanId}`,
        );

        return {
          success: true,
          data: response.data,
          statusCode: response.status,
        };
      } else {
        console.error('Token not found');

        return {
          success: false,
          data: null,
          statusCode: 401,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async returnLoan(loanId: number): Promise<ClientResponse<null>> {
    try {
      const token = Cookies.get('token');
      if (token) {
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        const response: AxiosResponse<null> = await this.client.put(
          `/loan/returnBook/${loanId}`,
        );

        return {
          success: true,
          data: response.data,
          statusCode: response.status,
        };
      } else {
        console.error('Token not found');

        return {
          success: false,
          data: null,
          statusCode: 401,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async extendLoan(loanId: number): Promise<ClientResponse<void>> {
    try {
      const token = Cookies.get('token');
      if (token) {
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;

        const loanResponse: AxiosResponse<LoanResponseDto> =
          await this.client.get(`/loan/getOne/${loanId}`);

        if (!loanResponse.data) {
          return {
            success: false,
            statusCode: 404,
            data: undefined,
          };
        }

        const currentDate = new Date();
        const oldDueDateString = loanResponse.data.dueDate;
        if (oldDueDateString) {
          const oldDueDate = new Date(oldDueDateString);

          const daysDiff = Math.floor(
            (oldDueDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24),
          );

          if (daysDiff > 0) {
            oldDueDate.setDate(oldDueDate.getDate() + 30);

            const formattedDueDate = oldDueDate.toISOString().split('T')[0];

            await this.client.put(`/loan/extendDueDate/${loanId}`, {
              dueDate: formattedDueDate,
            });
          } else {
            oldDueDate.setDate(currentDate.getDate() + 30);

            const formattedDueDate = oldDueDate.toISOString().split('T')[0];

            await this.client.put(`/loan/extendDueDate/${loanId}`, {
              dueDate: formattedDueDate,
            });
          }
        } else {
          return {
            success: false,
            statusCode: 401,
            data: undefined,
          };
        }

        return {
          success: true,
          statusCode: 200,
          data: undefined,
        };
      } else {
        console.error('Token not found');
        return {
          success: false,
          statusCode: 401,
          data: undefined,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        statusCode: axiosError.response?.status || 0,
        data: undefined,
      };
    }
  }

  public async getUserRole(): Promise<ClientResponse<any>> {
    try {
      const token = Cookies.get('token');
      if (token) {
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        const response: AxiosResponse<any> =
          await this.client.get('/user/getUserRole');
        return {
          success: true,
          data: response.data,
          statusCode: response.status,
        };
      } else {
        console.error('Token not found');
        return {
          success: false,
          data: null,
          statusCode: 401,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getUserId(): Promise<ClientResponse<any>> {
    try {
      const token = Cookies.get('token');
      if (token) {
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        const response: AxiosResponse<any> =
          await this.client.get('/user/getUserId');
        return {
          success: true,
          data: response.data,
          statusCode: response.status,
        };
      } else {
        console.error('Token not found');
        return {
          success: false,
          data: null,
          statusCode: 401,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getUserQueues(): Promise<
    ClientResponse<QueueResponseDto[] | null>
  > {
    try {
      const token = Cookies.get('token');
      if (token) {
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        const userId: AxiosResponse<any> =
          await this.client.get('/user/getUserId');
        const response: AxiosResponse<QueueResponseDto[]> =
          await this.client.get(`/queue/getAllUserQueues/${userId.data}`);

        return {
          success: true,
          data: response.data,
          statusCode: response.status,
        };
      } else {
        console.error('Token not found');

        return {
          success: false,
          data: null,
          statusCode: 401,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getUserStats(): Promise<
    ClientResponse<{ [key: string]: number } | null>
  > {
    try {
      const token = Cookies.get('token');
      if (token) {
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        const userId: AxiosResponse<any> =
          await this.client.get('/user/getUserId');
        const response: AxiosResponse<{ [key: string]: number }> =
          await this.client.get(`/user/getUserStats/${userId.data}`);

        return {
          success: true,
          data: response.data,
          statusCode: response.status,
        };
      } else {
        console.error('Token not found');

        return {
          success: false,
          data: null,
          statusCode: 401,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async deleteQueue(queueId: number): Promise<ClientResponse<null>> {
    try {
      const token = Cookies.get('token');
      if (token) {
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        const response: AxiosResponse<null> = await this.client.delete(
          `/queue/delete/${queueId}`,
        );

        return {
          success: true,
          data: response.data,
          statusCode: response.status,
        };
      } else {
        console.error('Token not found');

        return {
          success: false,
          data: null,
          statusCode: 401,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async addToQueue(
    selectedBookId: number,
  ): Promise<ClientResponse<void>> {
    try {
      const token = Cookies.get('token');
      if (token) {
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        const userIdResponse: AxiosResponse<any> =
          await this.client.get('/user/getUserId');
        const userId = userIdResponse.data;
        const queueData = new QueueDto(selectedBookId, userId);
        console.log(queueData);
        const response = await this.client.post('/queue/add', queueData);

        console.log('Response Data:', response.data);

        return {
          success: true,
          statusCode: response.status,
          data: undefined,
        };
      } else {
        console.error('Token not found');
        return {
          success: false,
          statusCode: 401,
          data: undefined,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        statusCode: axiosError.response?.status || 0,
        data: undefined,
      };
    }
  }

  public async getReviews(): Promise<
    ClientResponse<ReviewResponseDto[] | null>
  > {
    try {
      const token = Cookies.get('token');
      if (token) {
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        const response: AxiosResponse<ReviewResponseDto[]> =
          await this.client.get('/review/getAll');

        return {
          success: true,
          data: response.data,
          statusCode: response.status,
        };
      } else {
        console.error('Token not found');

        return {
          success: false,
          data: null,
          statusCode: 401,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getReviewsForBook(
    bookId: number,
  ): Promise<ClientResponse<ReviewResponseDto[] | null>> {
    try {
      const token = Cookies.get('token');
      if (token) {
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        const response: AxiosResponse<ReviewResponseDto[]> =
          await this.client.get(`/review/getByBook/${bookId}`);

        return {
          success: true,
          data: response.data,
          statusCode: response.status,
        };
      } else {
        console.error('Token not found');

        return {
          success: false,
          data: null,
          statusCode: 401,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async addReview(userData: any): Promise<ClientResponse<any>> {
    try {
      const token = Cookies.get('token');
      if (token) {
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        const response: AxiosResponse<any> = await this.client.post(
          '/review/add',
          userData,
        );

        return {
          success: true,
          data: response.data,
          statusCode: response.status,
        };
      } else {
        console.error('Token not found');

        return {
          success: false,
          data: null,
          statusCode: 401,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getUsers(): Promise<ClientResponse<UserResponseDto[] | null>> {
    try {
      const token = Cookies.get('token');
      if (token) {
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        const response: AxiosResponse<UserResponseDto[]> =
          await this.client.get('/user/getAll');

        return {
          success: true,
          data: response.data,
          statusCode: response.status,
        };
      } else {
        console.error('Token not found');

        return {
          success: false,
          data: null,
          statusCode: 401,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async deleteUser(id: number): Promise<ClientResponse<null>> {
    try {
      const token = Cookies.get('token');
      if (token) {
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        const response: AxiosResponse<null> = await this.client.delete(
          `/user/delete/${id}`,
        );

        return {
          success: true,
          data: response.data,
          statusCode: response.status,
        };
      } else {
        console.error('Token not found');

        return {
          success: false,
          data: null,
          statusCode: 401,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getUser(
    userId: number,
  ): Promise<ClientResponse<UserResponseDto | null>> {
    try {
      const token = Cookies.get('token');
      if (token) {
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        const response: AxiosResponse<UserResponseDto> = await this.client.get(
          `/user/getOne/${userId}`,
        );
        console.log(response.data);
        return {
          success: true,
          data: response.data,
          statusCode: response.status,
        };
      } else {
        console.error('Token not found');

        return {
          success: false,
          data: null,
          statusCode: 401,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async updateUser(
    userId: number,
    userData: UserDto,
  ): Promise<ClientResponse<UserResponseDto | null>> {
    try {
      const token = Cookies.get('token');
      if (token) {
        this.client.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        const response: AxiosResponse<UserResponseDto> = await this.client.put(
          `/user/edit/${userId}`,
          userData,
        );

        return {
          success: true,
          data: response.data,
          statusCode: response.status,
        };
      } else {
        console.error('Token not found');

        return {
          success: false,
          data: null,
          statusCode: 401,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }
}
