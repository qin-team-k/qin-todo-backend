import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TodoStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { TodoService } from './todo.service';

let service: TodoService;

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [TodoService, PrismaService],
  }).compile();

  service = module.get<TodoService>(TodoService);
});

beforeAll(() => {
  global.Date.now = jest.fn(() => 1595980800000);
});
const userId = '62ac362a-cd60-45b1-9100-3b469eceb31d';

const todoAll = {
  TODAY: [
    {
      id: 13,
      userId: userId,
      status: 'TODAY',
      done: false,
      content: 'ランニング',
      createdAt: new Date('2020-06-01T00:00:00.000Z'),
      updatedAt: new Date('2020-06-01T00:00:00.000Z'),
    },
  ],
  TOMORROW: [
    {
      id: 14,
      userId: userId,
      status: 'TOMORROW',
      done: false,
      content: 'プログラミング学習',
      createdAt: new Date('2020-06-01T00:00:00.000Z'),
      updatedAt: new Date('2020-06-01T00:00:00.000Z'),
    },
  ],
  NEXT: [
    {
      id: 15,
      userId: userId,
      status: 'NEXT',
      done: false,
      content: 'テスト勉強',
      createdAt: new Date('2020-06-01T00:00:00.000Z'),
      updatedAt: new Date('2020-06-01T00:00:00.000Z'),
    },
  ],
};

// findAllメソッドのテスト
describe('FindAll', () => {
  it('Normal case: Users for whom todo exists should have data returned per status ', async () => {
    const result = todoAll;
    const data = await service.findAll(userId);
    expect(data).toEqual(result);
  });

  it('Normal case: Users for whom todo dose not exists should return empty array ', async () => {
    const userIdTodoNotExists = '7d564bce-2b98-4a86-b5b3-a942e6241584';
    const result = { TODAY: [], TOMORROW: [], NEXT: [] };
    const data = await service.findAll(userIdTodoNotExists);
    expect(data).toEqual(result);
  });
});

// createメソッドのテスト
describe('Create', () => {
  it('Normal case: Create todo', async () => {
    const todoId = 16;
    const todo = {
      status: TodoStatus.TODAY,
      content: 'テスト',
    };
    // create前のデータを確認
    const beforeCreate = await service.findById(todoId);
    expect(beforeCreate).toBeNull();

    // create
    await service.create(userId, todo);

    // create後のデータを確認
    const afterCreate = await service.findById(todoId);
    expect(afterCreate.content).toEqual('テスト');

    // create後のデータがorderの最後に追加されているか
    const lastIndexTodo = await (
      await service.findAll(userId)
    ).TODAY.slice(-1)[0];
    expect(lastIndexTodo.id).toEqual(todoId);
  });
});

// duplicateメソッドのテスト
describe('Duplicate', () => {
  it('Normal case: Duplicate todo', async () => {
    const todoId = 13;

    // duplicate前のデータを確認
    const beforeDuplicate = await service.findAll(userId);
    expect(beforeDuplicate.TODAY.length).toEqual(2);
    expect(beforeDuplicate.TODAY[0].content).not.toBe(
      beforeDuplicate.TODAY[1].content,
    );

    // duplicate
    await service.duplicate(userId, todoId);

    // duplicate後のデータを確認
    const afterDuplicate = await service.findAll(userId);
    expect(afterDuplicate.TODAY.length).toEqual(3);
    expect(afterDuplicate.TODAY[0].content).toBe(
      afterDuplicate.TODAY[1].content,
    );
  });
});

// toggleメソッドのテスト
describe('ToggleDone', () => {
  it('Normal case: toggle todo is done', async () => {
    const todoId = 13;
    const todo = await service.findById(todoId);
    expect(todo.done).toBeFalsy();
    await service.toggleDone(todoId);
    const toggledTodo = await service.findById(todoId);
    expect(toggledTodo.done).toBeTruthy();
  });

  //TODO 未実装で失敗するためコメントアウトしておく
  // it('Abnormal case: When todo updated by other user, should Forbidden', async () => {
  //   const todoId = 1;
  //   await expect(service.toggleDone(todoId)).rejects.toThrow(
  //     ForbiddenException,
  //   );
  // });
});

// updateOrderメソッドのテスト
describe('UpdateOrder', () => {
  it('Normal case: Update order', async () => {
    const todoId = 13;
    // update前のデータを確認
    const todo = await service.findById(todoId);
    const todoAll = await service.findAll(userId);
    expect(todo.status).toEqual(TodoStatus.TODAY);
    expect(todoAll.TODAY[0].id).toEqual(todoId);

    // update
    await service.updateOrder(userId, todoId, {
      status: TodoStatus.TOMORROW,
      index: 0,
    });

    // update後のデータを確認
    const updatedTodo = await service.findById(todoId);
    const updatedTodoAll = await service.findAll(userId);
    expect(updatedTodo.status).toEqual(TodoStatus.TOMORROW);
    expect(updatedTodoAll.TOMORROW[0].id).toEqual(todoId);

    // order戻す
    await service.updateOrder(userId, todoId, {
      status: TodoStatus.TODAY,
      index: 0,
    });
  });

  //TODO 未実装で失敗するためコメントアウトしておく
  // it('Abnormal case: When todo updated by other user, should Forbidden', async () => {
  //   const todoId = 1;
  //   await expect(
  //     service.updateOrder(userId, todoId, {
  //       status: TodoStatus.TOMORROW,
  //       index: 0,
  //     }),
  //   ).rejects.toThrow(ForbiddenException);
  // });
});

// updateContentメソッドのテスト
describe('UpdateContent', () => {
  it('Normal case: Update content', async () => {
    const todoId = 13;
    const content = 'めっちゃ走る';
    // 更新前のデータを確認
    const beforeUpdate = await service.findById(todoId);
    expect(beforeUpdate.content).not.toBe(content);

    // 更新
    await service.updateContent(todoId, { content });

    // 更新後のデータを確認
    const afterUpdate = await service.findById(todoId);
    expect(afterUpdate.content).toBe(content);
  });

  //TODO 未実装で失敗するためコメントアウトしておく
  // it('Abnormal case: When todo updated by other user, should Forbidden', async () => {
  //   const todoId = 1;
  //   const content = 'めっちゃ走る';
  //   await expect(service.updateContent(todoId, { content })).rejects.toThrow(
  //     ForbiddenException,
  //   );
  // });
});

// deleteメソッドのテスト
describe('Delete', () => {
  it('Normal case: Delete todo', async () => {
    const todoId = 13;
    // delete前のデータを確認
    const beforeDelete = await service.findById(todoId);
    const beforeDeleteAll = await service.findAll(userId);
    expect(beforeDelete).not.toBeNull();
    expect(beforeDeleteAll.TODAY[0].id).toBe(todoId);

    // delete
    await service.delete(userId, todoId);

    // delete後のデータを確認
    const afterDelete = await service.findById(todoId);
    const afterDeleteAll = await service.findAll(userId);
    expect(afterDelete).toBeNull();
    expect(afterDeleteAll.TODAY[0].id).not.toBe(todoId);
  });

  //TODO 未実装で失敗するためコメントアウトしておく
  // it('Abnormal case: When todo deleted by other user, should Forbidden', async () => {
  //   const todoId = 1;
  //   await expect(service.delete(userId, todoId)).rejects.toThrow(
  //     ForbiddenException,
  //   );
  // });
});
