export class UserResponseDto {
  userId: number | undefined;
  userName: string | undefined;
  userPassword: string | undefined;
  role: string | undefined;
  email: string | undefined;
  userFirstName: string | undefined;
  userLastName: string | undefined;
}

export class UserDto {
  userName: string | undefined;
  role: string | undefined;
  email: string | undefined;
  userFirstName: string | undefined;
  userLastName: string | undefined;
}
