import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies';

@Module({
  controllers: [AuthController],
  providers: [GoogleStrategy, AuthService, PrismaService],
})
export class AuthModule {}
