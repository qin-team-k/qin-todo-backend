import { PrismaClient } from '@prisma/client';
import { todo } from '../../../prisma/seed/todo';
import { todoOrder } from '../../../prisma/seed/todoOrder';
import { user } from '../../../prisma/seed/user';

const prisma = new PrismaClient();
const DB_NAME = 'qin-todo';
export const resetDatabase = async (): Promise<void> => {
  // table一覧取得
  const query = `SELECT TABLE_NAME as tableName FROM information_schema.TABLES WHERE TABLE_SCHEMA = \"${DB_NAME}\"`;
  const tableNames = (
    (await prisma.$queryRawUnsafe(`${query}`)) as {
      tableName: string;
    }[]
  ).map((table) => table.tableName);

  await prisma.$transaction(async (prisma) => {
    // foreign keyを解除して、テーブルを削除
    await prisma.$queryRawUnsafe(`SET FOREIGN_KEY_CHECKS = 0`);
    tableNames.forEach(
      async (tableName) =>
        await prisma.$queryRawUnsafe(`TRUNCATE TABLE ${tableName}`),
    );
    await prisma.$queryRawUnsafe(`SET FOREIGN_KEY_CHECKS = 1`);
  });
  // データを入れ直す
  await user();
  await todo();
  await todoOrder();
};
