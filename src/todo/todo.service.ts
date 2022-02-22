import { PrismaService } from './../prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { USER_1, USER_2 } from 'src/constant';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}
  findAll() {
    return this.prisma.todo.findMany();
  }

  async create(payload: Prisma.TodoCreateInput) {
    const todo = await this.prisma.todo.create({
      data: {
        content: payload.content,
        status: 'TODAY',
        userId: USER_2,
      },
    });

    const todoOrders = await this.prisma.todoOrder.findMany({
      where: {
        userId: todo.userId,
        status: 'TODAY',
      },
    });

    if (todoOrders[0].todoIds === '') {
      return await this.prisma.todoOrder.updateMany({
        where: {
          userId: todo.userId,
          status: 'TODAY',
        },
        data: {
          todoIds: `${todo.id}`,
        },
      });
    } else {
      const currentTodoIds = todoOrders[0].todoIds.split(',');
      currentTodoIds.push(String(todo.id));
      return await this.prisma.todoOrder.updateMany({
        where: {
          userId: todo.userId,
          status: 'TODAY',
        },
        data: {
          todoIds: currentTodoIds.join(','),
        },
      });
    }
  }

  duplicate(todoId: number) {
    return `todo duplicated with ${todoId}`;
  }

  async toggleDone(todoId: number) {
    const todo = await this.prisma.todo.findUnique({
      where: {
        id: todoId,
      },
    });
    return this.prisma.todo.update({
      where: {
        id: todoId,
      },
      data: {
        done: !todo.done,
      },
    });
  }

  updateOrder() {
    return 'update order';
  }

  updateContent(todoId: number) {
    return `updated content with ${todoId}`;
  }

  delete(todoId: number) {
    return this.prisma.todo.delete({
      where: {
        id: todoId,
      },
    });
  }
}
