import { PrismaClient } from '@prisma/client';
import { todo } from './todo';
import { todoOrder } from './todoOrder';
import { user } from './user';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.todo.deleteMany();
  await prisma.todoOrder.deleteMany();
  await user();
  await todo();
  await todoOrder();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
