import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { USER_2 } from 'src/constant';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  // Todo一覧取得
  async findAll() {
    const todoOrders = await this.prisma.todoOrder.findMany({
      where: {
        userId: USER_2,
      },
    });
    const todayTodoOrder = todoOrders.filter(
      (todoOrder) => todoOrder.status === 'TODAY',
    );
    const tomorrowTodoOrder = todoOrders.filter(
      (todoOrder) => todoOrder.status === 'TOMORROW',
    );
    const nextTodoOrder = todoOrders.filter(
      (todoOrder) => todoOrder.status === 'NEXT',
    );

    const todayTodoIds = todayTodoOrder[0].todoIds.split(',');
    const tomorrowTodoIds = tomorrowTodoOrder[0].todoIds.split(',');
    const nextTodoIds = nextTodoOrder[0].todoIds.split(',');

    const todos = await this.prisma.todo.findMany();

    const TOMORROW = tomorrowTodoIds.map((id) =>
      todos.find((todo) => todo.id === Number(id)),
    );
    const NEXT = nextTodoIds.map((id) =>
      todos.find((todo) => todo.id === Number(id)),
    );
    const TODAY = todayTodoIds.map((id) =>
      todos.find((todo) => todo.id === Number(id)),
    );

    return {
      TODAY: TODAY.filter(Boolean),
      TOMORROW,
      NEXT,
    };
  }

  // Todo作成
  async create(payload: Prisma.TodoCreateInput) {
    const todo = await this.prisma.todo.create({
      data: {
        content: payload.content,
        status: payload.status,
        userId: USER_2,
      },
    });

    const todoOrders = await this.prisma.todoOrder.findMany({
      where: {
        userId: todo.userId,
        status: payload.status,
      },
    });

    if (todoOrders[0].todoIds === '') {
      await this.prisma.todoOrder.updateMany({
        where: {
          userId: todo.userId,
          status: payload.status,
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
          status: payload.status,
        },
        data: {
          todoIds: currentTodoIds.join(','),
        },
      });
      return todo;
    }
  }

  // Todo複製
  async duplicate(todoId: number) {
    const todo = await this.prisma.todo.findUnique({
      where: { id: todoId },
    });
    const duplicatedTodo = await this.prisma.todo.create({
      data: {
        content: todo.content,
        userId: USER_2,
        status: todo.status,
      },
    });

    const todoOrders = await this.prisma.todoOrder.findMany({
      where: {
        userId: todo.userId,
        status: todo.status,
      },
    });
    const currentTodoIds = todoOrders[0].todoIds.split(',');
    const todoIdIndex = currentTodoIds.indexOf(String(todo.id));
    currentTodoIds.splice(todoIdIndex + 1, 0, String(duplicatedTodo.id));
    await this.prisma.todoOrder.updateMany({
      where: {
        userId: todo.userId,
        status: todo.status,
      },
      data: {
        todoIds: currentTodoIds.join(','),
      },
    });

    return duplicatedTodo;
  }

  // 完了・未完了の切り替え
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

  // Todo並び替え
  async updateOrder(
    todoId: number,
    payload: Prisma.TodoCreateInput,
    index: number,
  ) {
    // まず対象のTodoを削除
    const deletedTodo = await this.prisma.todo.delete({
      where: {
        id: todoId,
      },
    });

    // todoOrderテーブルからも削除
    const currentTodoOrders = await this.prisma.todoOrder.findMany({
      where: {
        userId: USER_2,
        status: deletedTodo.status,
      },
    });
    const currentTodoIds = currentTodoOrders[0].todoIds.split(',');
    const deletedTodoIds = currentTodoIds.filter(
      (todoId) => todoId !== String(deletedTodo.id),
    );

    await this.prisma.todoOrder.updateMany({
      where: {
        userId: currentTodoOrders[0].userId,
        status: deletedTodo.status,
      },
      data: {
        todoIds: deletedTodoIds.join(','),
      },
    });

    // 削除したTodoを引数のstatusで復活!!
    const movedTodo = await this.prisma.todo.create({
      data: {
        content: deletedTodo.content,
        userId: USER_2,
        status: payload.status,
        done: payload.done,
      },
    });

    // todoOrderテーブルへ追加
    const newTodoOrders = await this.prisma.todoOrder.findMany({
      where: {
        userId: USER_2,
        status: movedTodo.status,
      },
    });

    if (newTodoOrders[0].todoIds === '') {
      newTodoOrders[0].todoIds = String(movedTodo.id);
      await this.prisma.todoOrder.updateMany({
        where: {
          userId: movedTodo.userId,
          status: payload.status,
        },
        data: {
          todoIds: newTodoOrders[0].todoIds,
        },
      });
      return movedTodo;
    } else {
      const currentNewTodoIds = newTodoOrders[0].todoIds.split(',');
      currentNewTodoIds.splice(index, 0, String(movedTodo.id));

      await this.prisma.todoOrder.updateMany({
        where: {
          userId: movedTodo.userId,
          status: payload.status,
        },
        data: {
          todoIds: currentNewTodoIds.join(','),
        },
      });

      return movedTodo;
    }
  }

  // Todo内容更新
  updateContent(todoId: number, payload: Prisma.TodoCreateInput) {
    return this.prisma.todo.update({
      where: { id: todoId },
      data: {
        content: payload.content,
      },
    });
  }

  // Todo削除
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

    const currentTodoIds = todoOrders[0].todoIds.split(',');
    const deletedTodoIds = currentTodoIds.filter(
      (todoId) => todoId !== String(deletedTodo.id),
    );
    await this.prisma.todoOrder.updateMany({
      where: {
        userId: todoOrders[0].userId,
        status: deletedTodo.status,
      },
      data: {
        todoIds: deletedTodoIds.join(','),
      },
    });
    return deletedTodo;
  }
}
