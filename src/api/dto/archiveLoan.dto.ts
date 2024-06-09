import { UserResponseDto } from './user.dto';
import { BookResponseDto } from './book.dto';

export class LoanArchiveResponseDto {
  loanArchiveId: number | undefined;
  user: UserResponseDto | undefined;
  book: BookResponseDto | undefined;
  loanDate: string | undefined;
  dueDate: string | undefined;
  returnDate: string | undefined;
}
