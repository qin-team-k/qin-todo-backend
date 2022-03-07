import { Module } from '@nestjs/common';
import { SessionSerializer } from 'src/common/serializer/session.serializer';
import { GoogleStrategy } from 'src/common/strategies/google.strategy';
import { PrismaService } from 'src/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [GoogleStrategy, SessionSerializer, AuthService, PrismaService],
})
export class AuthModule {}
