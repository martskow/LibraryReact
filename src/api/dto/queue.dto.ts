import { BookResponseDto } from './book.dto';
import { UserResponseDto } from './user.dto';

export class QueueResponseDto {
  queueId: number | undefined;
  user: UserResponseDto | undefined;
  book: BookResponseDto | undefined;
  queuingDate: string | undefined;
}

export class QueueDto {
  book: { id: number };
  user: { userId: number };

  constructor(bookId: number, userId: number) {
    this.book = { id: bookId };
    this.user = { userId: userId };
  }
}
