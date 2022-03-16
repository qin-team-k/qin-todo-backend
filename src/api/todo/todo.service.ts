import { Injectable } from '@nestjs/common';
import { Todo, TodoOrder, TodoStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoOrderDto } from './dto/update-todo-order.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { FindAllRes } from './response/findAll.response.';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  // Todo一覧取得
  async findAll(userId: string): Promise<FindAllRes> {
    // todoStatusをキーにした、todoIdsを取得
    const todoOrders = await this.findOrdersByUserId(userId);
    const todoIdsMap = this.getTodoIdsMap(todoOrders);

    // todoStatusをキーにした、todoの配列を取得
    const todos = await this.findTodoByUserId(userId);
    const todosMap = this.getTodosMap(todos, todoIdsMap);

    return {
      TODAY: todosMap.get(TodoStatus.TODAY),
      TOMORROW: todosMap.get(TodoStatus.TOMORROW),
      NEXT: todosMap.get(TodoStatus.NEXT),
    };
  }

  // Todo作成
  // FIXME トランザクションを追加
  async create(userId: string, createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = await this.prisma.todo.create({
      data: {
        userId,
        status: createTodoDto.status,
        content: createTodoDto.content,
      },
    });

    // todoOrderを取得して、作成したtodoを末尾に追加
    const todoOrders = await this.findOrderByUnique(userId, todo.status);
    const todoIds: string[] | null = todoOrders.todoIds?.split(',');
    const addedTodoIds: string = todoIds
      ? this.addTodoOrderId(todoIds, todo.id, todoIds.length).join(',')
      : `${todo.id}`;

    // todoOrderを更新
    todoOrders.todoIds = addedTodoIds;
    await this.updateTodoOrder(todoOrders);

    return todo;
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
    await this.prisma.todo.update({
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

  // Todoを1件取得
  async findTodoById(todoId: number): Promise<Todo> {
    return await this.prisma.todo.findUnique({
      where: { id: todoId },
    });
  }

  // todoStatusをキーにした、todoの配列を取得
  private getTodosMap(
    todos: Todo[],
    todoIdsMap: Map<TodoStatus, number[]>,
  ): Map<TodoStatus, Todo[]> {
    const todosMap = new Map<TodoStatus, Todo[]>();
    todoIdsMap.forEach((todoIds, status) => {
      todosMap.set(
        status,
        todoIds.map((id) => todos.find((todo) => todo.id === id)),
      );
    });
    return todosMap;
  }

  // todoStatusをキーにした、Idの配列を取得
  private getTodoIdsMap(todoOrders: TodoOrder[]): Map<TodoStatus, number[]> {
    const todoIdsMap = new Map<TodoStatus, number[]>();
    (Object.keys(TodoStatus) as TodoStatus[]).forEach((status) => {
      todoIdsMap.set(
        status,
        todoOrders
          .find((todoOrder) => todoOrder.status === status)
          .todoIds?.split(',')
          ?.map((id) => Number(id)) ?? [],
      );
    });
    return todoIdsMap;
  }

  // 指定されたindexにidを挿入
  private addTodoOrderId(
    todoIds: string[],
    todoId: number,
    index: number,
  ): string[] {
    const copy = [...todoIds];
    copy.splice(index || todoIds.length, 0, String(todoId));
    return copy;
  }

  private async findTodoByUserId(userId: string): Promise<Todo[]> {
    return await this.prisma.todo.findMany({
      where: { userId },
    });
  }

  private async findOrdersByUserId(userId: string): Promise<TodoOrder[]> {
    return await this.prisma.todoOrder.findMany({
      where: { userId },
    });
  }

  private async findOrderByUnique(userId: string, status: TodoStatus) {
    return await this.prisma.todoOrder.findUnique({
      where: {
        userId_status: {
          userId,
          status,
        },
      },
    });
  }

  private async updateTodoOrder(todoOrder: TodoOrder) {
    return await this.prisma.todoOrder.update({
      where: {
        userId_status: {
          userId: todoOrder.userId,
          status: todoOrder.status,
        },
      },
      data: {
        todoIds: todoOrder.todoIds,
      },
    });
  }
}
