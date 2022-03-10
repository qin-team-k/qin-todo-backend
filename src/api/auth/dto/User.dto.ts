import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
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
