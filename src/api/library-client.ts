import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { BookResponseDto } from './dto/book.dto';

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
}