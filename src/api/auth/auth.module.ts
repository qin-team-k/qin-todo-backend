import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from 'src/common/strategies';
import { GoogleStrategy } from 'src/common/strategies/google.strategy';
import { PrismaService } from 'src/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AuthService,
    PrismaService,
  ],
})
export class AuthModule {}
