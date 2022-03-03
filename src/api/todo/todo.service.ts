import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoOrderDto } from './dto/update-todo-order.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { FindAllRes } from './response/findAll.response.';
import { Todo, TodoStatus } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  // Todo一覧取得
  async findAll(userId: string): Promise<FindAllRes> {
    const todoOrders = await this.prisma.todoOrder.findMany({
      where: {
        userId,
      },
    });
    const todayTodoOrder = todoOrders.filter(
      (todoOrder) => todoOrder.status === TodoStatus.TODAY,
    );
    const tomorrowTodoOrder = todoOrders.filter(
      (todoOrder) => todoOrder.status === TodoStatus.TOMORROW,
    );
    const nextTodoOrder = todoOrders.filter(
      (todoOrder) => todoOrder.status === TodoStatus.NEXT,
    );

    let todayTodoIds: string[];
    let tomorrowTodoIds: string[];
    let nextTodoIds: string[];

    if (todayTodoOrder[0].todoIds) {
      todayTodoIds = todayTodoOrder[0].todoIds.split(',');
    } else {
      todayTodoIds = [];
    }

    if (tomorrowTodoOrder[0].todoIds) {
      tomorrowTodoIds = tomorrowTodoOrder[0].todoIds.split(',');
    } else {
      tomorrowTodoIds = [];
    }

    if (nextTodoOrder[0].todoIds) {
      nextTodoIds = nextTodoOrder[0].todoIds.split(',');
    } else {
      nextTodoIds = [];
    }

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
  async create(userId: string, todo: CreateTodoDto): Promise<Todo> {
    const createdTodo = await this.prisma.todo.create({
      data: {
        userId,
        status: todo.status,
        content: todo.content,
      },
    });

    const todoOrders = await this.prisma.todoOrder.findUnique({
      where: {
        userId_status: {
          userId,
          status: todo.status,
        },
      },
    });

    if (todoOrders.todoIds === '') {
      await this.prisma.todoOrder.update({
        where: {
          userId_status: {
            userId,
            status: todo.status,
          },
        },
        data: {
          todoIds: `${createdTodo.id}`,
        },
      });
      return createdTodo;
    } else {
      const currentTodoIds = todoOrders.todoIds.split(',');
      currentTodoIds.push(String(createdTodo.id));
      await this.prisma.todoOrder.update({
        where: {
          userId_status: {
            userId,
            status: todo.status,
          },
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
  async duplicate(userId: string, todoId: number): Promise<Todo> {
    const todo = await this.prisma.todo.findUnique({
      where: { id: todoId },
    });
    const duplicatedTodo = await this.prisma.todo.create({
      data: {
        userId,
        status: todo.status,
        content: todo.content,
      },
    });

    const todoOrders = await this.prisma.todoOrder.findUnique({
      where: {
        userId_status: {
          userId,
          status: todo.status,
        },
      },
    });
    const currentTodoIds = todoOrders.todoIds.split(',');
    const todoIdIndex = currentTodoIds.indexOf(String(todo.id));
    currentTodoIds.splice(todoIdIndex + 1, 0, String(duplicatedTodo.id));
    await this.prisma.todoOrder.update({
      where: {
        userId_status: {
          userId,
          status: todo.status,
        },
      },
      data: {
        todoIds: currentTodoIds.join(','),
      },
    });

    return duplicatedTodo;
  }

  // 完了・未完了の切り替え
  async toggleDone(todoId: number): Promise<Todo> {
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
  ): Promise<void> {
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
    const deletedTodoIds = currentTodoOrders.todoIds
      .split(',')
      .filter((id) => id !== String(todoId));
    const deletedTodoOrder = await this.prisma.todoOrder.update({
      where: {
        userId_status: {
          userId,
          status: currentTodo.status,
        },
      },
      data: {
        todoIds: deletedTodoIds.join(','),
      },
    });

    if (!deletedTodoOrder.todoIds) {
      await this.prisma.todoOrder.update({
        where: {
          userId_status: {
            userId,
            status: currentTodo.status,
          },
        },
        data: {
          todoIds: null,
        },
      });
    }

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
    if (updateTodoOrders.todoIds) {
      const newTodoIds = updateTodoOrders.todoIds.split(',');
      newTodoIds.splice(todo.index, 0, String(todoId));

      await this.prisma.todoOrder.update({
        where: {
          userId_status: {
            userId,
            status: todo.status,
          },
        },
        data: {
          todoIds: newTodoIds.join(','),
        },
      });
    } else {
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
    }
  }

  // Todo内容更新
  updateContent(todoId: number, todo: UpdateTodoDto): Promise<Todo> {
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

    if (deletedTodoIds.length) {
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
    } else {
      await this.prisma.todoOrder.update({
        where: {
          userId_status: {
            userId,
            status: deletedTodo.status,
          },
        },
        data: {
          todoIds: null,
        },
      });
    }
  }
}
