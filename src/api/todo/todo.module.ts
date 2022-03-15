import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserModule } from '../user/user.module';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  imports: [UserModule],
  controllers: [TodoController],
  providers: [TodoService, PrismaService],
})
export class TodoModule {}
