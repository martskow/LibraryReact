import { BookResponseDto } from './book.dto';
import { UserResponseDto } from './user.dto';

export class ReviewResponseDto {
  reviewId: number | undefined;
  user: UserResponseDto | undefined;
  book: BookResponseDto | undefined;
  comment: string | undefined;
  rating: number | undefined;
  reviewDate: string | undefined;

  constructor(
    reviewId: number | undefined,
    user: UserResponseDto | undefined,
    book: BookResponseDto | undefined,
    comment: string | undefined,
    rating: number | undefined,
    reviewDate: string | undefined,
  ) {
    this.reviewId = reviewId;
    this.user = user;
    this.book = book;
    this.comment = comment;
    this.rating = rating;
    this.reviewDate = reviewDate;
  }
}
