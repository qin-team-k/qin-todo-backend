import { PrismaClient } from '@prisma/client';
import { todo } from './todo';
import { todoOrder } from './todoOrder';
import { user } from './user';

const prisma = new PrismaClient();

async function main() {
  await prisma.todoOrder.deleteMany();
  await prisma.todo.deleteMany();
  await prisma.user.deleteMany();
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
