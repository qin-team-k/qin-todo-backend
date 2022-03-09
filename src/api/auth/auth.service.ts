import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async validateUser(googleUserDetails): Promise<User> {
    const { email } = googleUserDetails;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) return user;

    return await this.createUser(googleUserDetails);
  }

  async createUser(googleUserDetails): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        username: googleUserDetails.username,
        email: googleUserDetails.email,
        avatarUrl: googleUserDetails.avatarUrl,
      },
    });
    await this.prisma.todoOrder.createMany({
      data: [
        { userId: user.id, status: 'TODAY' },
        { userId: user.id, status: 'TOMORROW' },
        { userId: user.id, status: 'NEXT' },
      ],
    });
    return user;
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async issueTokens(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new ForbiddenException('Access denied');
    const tokens = await this.getTokens(user);
    await this.updateDBRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access denied');

    const IsRefreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );

    if (!IsRefreshTokenMatches) throw new ForbiddenException('Access denied');
    const tokens = await this.getTokens(user);

    await this.updateDBRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async findUser(email: string): Promise<User | undefined> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateDBRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });
  }

  async getTokens(user: User) {
    const { id, username, email, avatarUrl } = user;
    const jwtPayload = {
      sub: id,
      username,
      email,
      avatarUrl,
    };

    const [access_token, refresh_token] = await Promise.all([
      //access token
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.TOKEN_SECRET,
        expiresIn: '15m',
      }),

      //refresh token
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.TOKEN_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }
}
