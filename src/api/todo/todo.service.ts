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
    const todo = await this.createTodo(
      userId,
      createTodoDto.content,
      createTodoDto.status,
    );

    // todoOrderを取得して、作成したtodoを末尾に追加
    const todoOrders = await this.findOrderByUnique(userId, todo.status);
    const todoIds: string[] | null = todoOrders.todoIds?.split(',');
    const addedTodoIds: string = this.addOrderId(
      todoIds,
      todo.id,
      todoIds.length,
    );

    // todoOrderを更新
    todoOrders.todoIds = addedTodoIds;
    await this.updateTodoOrder(todoOrders);

    return todo;
  }

  // Todo複製
  // FIXME トランザクションを追加
  async duplicate(userId: string, todoId: number): Promise<Todo> {
    const originalTodo = await this.findTodoById(todoId);
    const duplicatedTodo = await this.createTodo(
      userId,
      originalTodo.content,
      originalTodo.status,
    );

    // todoOrderを取得して、複製元のtodoの後ろに追加
    const todoOrder = await this.findOrderByUnique(userId, originalTodo.status);
    const originalTodoIds = todoOrder.todoIds.split(',');
    const originalTodoIndex = originalTodoIds.indexOf(String(originalTodo.id));
    const todoIdJoin = this.addOrderId(
      originalTodoIds,
      duplicatedTodo.id,
      originalTodoIndex + 1,
    );

    // todoOrderを更新
    todoOrder.todoIds = todoIdJoin;
    await this.updateTodoOrder(todoOrder);

    return duplicatedTodo;
  }

  // 完了・未完了の切り替え
  async toggleDone(todoId: number): Promise<Todo> {
    const todo = await this.findTodoById(todoId);
    todo.done = !todo.done;
    return this.updateTodo(todo);
  }

  // Todo並び替え
  // FIXME トランザクションを追加
  async updateOrder(
    userId: string,
    todoId: number,
    todoOrderDto: UpdateTodoOrderDto,
  ): Promise<void> {
    // 変更対象のTodoを取得
    const targetTodo = await this.findTodoById(todoId);

    // 移動元・移動先のTodoOrderを取得
    const fromOrder = await this.findOrderByUnique(userId, targetTodo.status);
    const toOrder = await this.findOrderByUnique(userId, todoOrderDto.status);

    // todoStatusを更新
    targetTodo.status = todoOrderDto.status;
    await this.updateTodo(targetTodo);

    // 移動元から削除
    fromOrder.todoIds = this.removeOrderId(
      fromOrder.todoIds.split(','),
      todoId,
    );
    await this.updateTodoOrder(fromOrder);

    // 移動先に追加
    const todoIds: string[] | null = toOrder.todoIds?.split(',');
    toOrder.todoIds = this.addOrderId(todoIds, todoId, todoOrderDto.index);
    await this.updateTodoOrder(toOrder);
  }

  // Todo内容更新
  async updateContent(
    todoId: number,
    updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    const todo = await this.findTodoById(todoId);
    todo.content = updateTodoDto.content;
    return await this.updateTodo(todo);
  }

  // Todo削除
  // FIXME トランザクションを追加
  async delete(userId: string, todoId: number): Promise<void> {
    const deletedTodo = await this.deleteTodo(todoId);

    // todoOrderから削除
    const todoOrder = await this.findOrderByUnique(userId, deletedTodo.status);
    todoOrder.todoIds = await this.removeOrderId(
      todoOrder.todoIds.split(','),
      todoId,
    );
    await this.updateTodoOrder(todoOrder);
  }

  // Todoを1件取得
  async findTodoById(todoId: number): Promise<Todo> {
    return await this.prisma.todo.findUnique({
      where: { id: todoId },
    });
  }

  async findOrderByUnique(userId: string, status: TodoStatus) {
    return await this.prisma.todoOrder.findUnique({
      where: {
        userId_status: {
          userId,
          status,
        },
      },
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

  // 指定されたindexにidを挿入し、joinして返す
  // todoIdsがnullであれば、idをそのまま返す
  private addOrderId(
    todoIds: string[] | null,
    todoId: number,
    index: number,
  ): string {
    if (!todoIds) {
      return String(todoId);
    }
    const copy = [...todoIds];
    copy.splice(index, 0, String(todoId));
    return copy.join(',');
  }

  // 指定されたidを削除し、joinして返す
  // 削除後に、配列が空になったらnullを返す
  private removeOrderId(todoIds: string[], todoId: number): string | null {
    const copy = [...todoIds];
    const deleteTodoIds = copy.filter((id) => id !== String(todoId));
    return deleteTodoIds.length != 0 ? deleteTodoIds.join(',') : null;
  }

  private async createTodo(
    userId: string,
    content: string,
    status: TodoStatus,
  ): Promise<Todo> {
    return await this.prisma.todo.create({
      data: {
        userId,
        content,
        status,
      },
    });
  }

  private async updateTodo(todo: Todo): Promise<Todo> {
    return await this.prisma.todo.update({
      where: { id: todo.id },
      data: {
        content: todo.content,
        status: todo.status,
        done: todo.done,
      },
    });
  }

  private async deleteTodo(todoId: number): Promise<Todo> {
    return await this.prisma.todo.delete({
      where: { id: todoId },
    });
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
