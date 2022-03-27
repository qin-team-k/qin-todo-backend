import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, CloudStorageService],
  exports: [UserService],
})
export class UserModule {}
