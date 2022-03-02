import { UpdateTodoDto } from './dto/update-todo.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoOrderDto } from './dto/update-todo-order.dto';
import { Todo } from '@prisma/client';
import { FindAllDto } from './dto/find-all-dto';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  // Todo一覧取得
  async findAll(userId: string): Promise<FindAllDto> {
    const todoOrders = await this.prisma.todoOrder.findMany({
      where: {
        userId,
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

    const todos = await this.prisma.todo.findMany({
      where: {
        userId,
      },
    });

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
      TODAY,
      TOMORROW,
      NEXT,
    };
  }

  // Todo作成
  // FIXME トランザクションを追加
  async create(userId: string, todo: CreateTodoDto): Promise<CreateTodoDto> {
    const createdTodo = await this.prisma.todo.create({
      data: {
        content: todo.content,
        userId,
        status: todo.status,
      },
    });

    const todoOrders = await this.prisma.todoOrder.findMany({
      where: {
        userId: todo.userId,
        status: todo.status,
      },
    });

    if (todoOrders[0].todoIds === '') {
      await this.prisma.todoOrder.updateMany({
        where: {
          userId: todo.userId,
          status: todo.status,
        },
        data: {
          todoIds: `${todo.id}`,
        },
      });
      return createdTodo;
    } else {
      const currentTodoIds = todoOrders[0].todoIds.split(',');
      currentTodoIds.push(String(todo.id));
      await this.prisma.todoOrder.updateMany({
        where: {
          userId: todo.userId,
          status: todo.status,
        },
        data: {
          todoIds: currentTodoIds.join(','),
        },
      });
      return createdTodo;
    }
  }

  // Todo複製
  // FIXME トランザクションを追加
  async duplicate(userId: string, todoId: number): Promise<CreateTodoDto> {
    const todo = await this.prisma.todo.findUnique({
      where: { id: todoId },
    });
    const duplicatedTodo = await this.prisma.todo.create({
      data: {
        content: todo.content,
        userId,
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
  async toggleDone(todoId: number): Promise<CreateTodoDto> {
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
  // FIXME トランザクションを追加
  async updateOrder(
    userId: string,
    todoId: number,
    todo: UpdateTodoOrderDto,
  ): Promise<CreateTodoDto> {
    // 現在のTodoを取得
    const currentTodo = await this.prisma.todo.findUnique({
      where: { id: todoId },
    });

    // 現在のtodoOrderを取得
    const currentTodoOrders = await this.prisma.todoOrder.findUnique({
      where: {
        userId_status: {
          userId,
          status: currentTodo.status,
        },
      },
    });

    // 文字配列に変換し配列から削除
    const updatedTodoIds = currentTodoOrders.todoIds
      .split(',')
      .filter((id) => id !== String(todoId));

    // 再び文字列に戻しTodoOrderを更新
    await this.prisma.todoOrder.update({
      where: {
        userId_status: {
          userId,
          status: currentTodo.status,
        },
      },
      data: {
        todoIds: updatedTodoIds.join(','),
      },
    });

    // Todoを更新
    const updatedTodo = await this.prisma.todo.update({
      where: { id: todoId },
      data: { status: todo.status },
    });

    // 更新先のtodoOrderを取得
    const updateTodoOrders = await this.prisma.todoOrder.findUnique({
      where: {
        userId_status: {
          userId,
          status: todo.status,
        },
      },
    });

    // FIXME リファクタ
    // 更新先のtodoOrderがnullかどうか
    if (updateTodoOrders.todoIds === '') {
      updateTodoOrders.todoIds = String(todoId);
      await this.prisma.todoOrder.update({
        where: {
          userId_status: {
            userId,
            status: todo.status,
          },
        },
        data: {
          todoIds: updateTodoOrders.todoIds,
        },
      });
      return updatedTodo;
    } else {
      // 文字配列に変換し新たなインデックスへ追加
      const currentNewTodoIds = updateTodoOrders.todoIds.split(',');
      currentNewTodoIds.splice(todo.index, 0, String(todoId));

      await this.prisma.todoOrder.update({
        where: {
          userId_status: {
            userId,
            status: todo.status,
          },
        },
        data: {
          todoIds: currentNewTodoIds.join(','),
        },
      });

      return updatedTodo;
    }
  }

  // Todo内容更新
  updateContent(todoId: number, todo: UpdateTodoDto): Promise<CreateTodoDto> {
    return this.prisma.todo.update({
      where: { id: todoId },
      data: {
        content: todo.content,
      },
    });
  }

  // Todo削除
  // FIXME トランザクションを追加
  async delete(userId: string, todoId: number): Promise<void> {
    const deletedTodo = await this.prisma.todo.delete({
      where: {
        id: todoId,
      },
    });

    const todoOrder = await this.prisma.todoOrder.findUnique({
      where: {
        userId_status: {
          userId,
          status: deletedTodo.status,
        },
      },
    });

    const currentTodoIds = todoOrder.todoIds.split(',');
    const deletedTodoIds = currentTodoIds.filter(
      (id) => id !== String(deletedTodo.id),
    );

    await this.prisma.todoOrder.update({
      where: {
        userId_status: {
          userId,
          status: deletedTodo.status,
        },
      },
      data: {
        todoIds: deletedTodoIds.join(','),
      },
    });
  }
}
