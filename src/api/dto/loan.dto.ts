import { BookResponseDto } from './book.dto';
import { UserResponseDto } from './user.dto';

export class LoanResponseDto {
  loanId: number | undefined;
  user: UserResponseDto | undefined;
  book: BookResponseDto | undefined;
  loanDate: string | undefined;
  dueDate: string | undefined;
  returnDate: string | undefined;
}

export class LoanDto {
  user: { userName: string | undefined } | undefined;
  book: { isbn: string | undefined } | undefined;
}
