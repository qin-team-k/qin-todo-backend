import { Module } from '@nestjs/common';
import { GoogleStrategy } from 'src/common/strategies/google.strategy';
import { PrismaService } from 'src/prisma.service';
import { SessionSerializer } from '../../common/serializer/session.serializer';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [GoogleStrategy, SessionSerializer, AuthService, PrismaService],
})
export class AuthModule {}
