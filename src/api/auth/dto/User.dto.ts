import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;

  uid: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  avatarUrl: string;

  createdAt: Date;
  updatedAt: Date;
}
