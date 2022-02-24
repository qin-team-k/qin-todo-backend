import { PrismaService } from './../prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, TodoStatus } from '@prisma/client';
import { USER_1, USER_2 } from 'src/constant';
import { CreateTodoDto } from './dto/todo.dto';

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
        userId: USER_2,
      },
    });

    const todoOrders = await this.prisma.todoOrder.findMany({
      where: {
        userId: todo.userId,
        status: TodoStatus.TODAY,
      },
    });

    if (todoOrders[0].todoIds === '') {
      await this.prisma.todoOrder.updateMany({
        where: {
          userId: todo.userId,
          status: TodoStatus.TODAY,
        },
        data: {
          todoIds: `${todo.id}`,
        },
      });
      return todo;
    } else {
      const currentTodoIds = todoOrders[0].todoIds.split(',');
      currentTodoIds.push(String(todo.id));
      await this.prisma.todoOrder.updateMany({
        where: {
          userId: todo.userId,
          status: TodoStatus.TODAY,
        },
        data: {
          todoIds: currentTodoIds.join(','),
        },
      });
      return todo;
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

  async updateOrder(todoId: number) {
    const todo = await this.prisma.todo.findUnique({
      where: { id: todoId },
    });
    return todo;
  }

  updateContent(todoId: number, payload: Prisma.TodoCreateInput) {
    return this.prisma.todo.update({
      where: { id: todoId },
      data: {
        content: payload.content,
      },
    });
  }

  async delete(todoId: number) {
    const deletedTodo = await this.prisma.todo.delete({
      where: {
        id: todoId,
      },
    });

    const todoOrders = await this.prisma.todoOrder.findMany({
      where: {
        userId: USER_2,
        status: deletedTodo.status,
      },
    });

    if (todoOrders[0].todoIds === '') {
      throw new NotFoundException('todo not found');
    } else {
      const currentTodoIds = todoOrders[0].todoIds.split(',');
      const deletedTodoIds = currentTodoIds.filter(
        (todoId) => todoId !== String(deletedTodo.id),
      );
      await this.prisma.todoOrder.updateMany({
        where: {
          userId: USER_2,
          status: deletedTodo.status,
        },
        data: {
          todoIds: deletedTodoIds.join(','),
        },
      });
      return deletedTodo;
    }
  }
}
