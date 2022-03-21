import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { GetCurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthenticateGuard } from 'src/common/guards/authenticate/authenticate.guard';
import { multerOptions } from 'src/utils/file-upload.utils';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(AuthenticateGuard)
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * GET /api/v1/users
   * ユーザー情報を返す
   */

  @Version('1')
  @Get()
  async users(@GetCurrentUser() user: User): Promise<User> {
    return user;
  }

  /**
   * PUT /api/v1/users/:userId
   * ユーザー名を更新する
   */

  @Version('1')
  @Put(':userId')
  async updateUser(
    @GetCurrentUser() user: User,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updateUser: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUsername(
      user.id,
      userId,
      updateUser.username,
    );
  }

  /**
   * PUT /api/v1/users/:userId/avatar
   * アバター画像を更新する
   */

  @Version('1')
  @Put(':userId/avatar')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async updateAvatar(
    @GetCurrentUser() user: User,
    @Param('userId', ParseUUIDPipe) userId: string,
    @UploadedFile() avatarImage: Express.Multer.File,
  ): Promise<any> {
    return this.userService.updateAvatarUrl(user.id, userId, avatarImage);
  }

  /**
   * DELETE /api/v1/users/delete
   * ユーザーを削除する
   */
  @Version('1')
  @Delete('delete')
  async delete(@GetCurrentUser() user: User): Promise<void> {
    await this.userService.deleteUser(user.id);
  }
}
