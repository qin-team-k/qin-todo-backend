import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const todoOrder = async () => {
  await prisma.todoOrder.createMany({
    data: [
      {
        id: 1,
        userId: '4ff64eb1-c22a-4455-a50d-75cdc3c1e561',
        status: 'TODAY',
        todoIds: '1,2,3,4',
      },
      {
        id: 2,
        userId: '4ff64eb1-c22a-4455-a50d-75cdc3c1e561',
        status: 'TOMORROW',
        todoIds: '5,6,7,8',
      },
      {
        id: 3,
        userId: '4ff64eb1-c22a-4455-a50d-75cdc3c1e561',
        status: 'NEXT',
        todoIds: '8,10,11,12',
      },
      {
        id: 4,
        userId: '62ac362a-cd60-45b1-9100-3b469eceb31d',
        status: 'TODAY',
        todoIds: '',
      },
      {
        id: 5,
        userId: '62ac362a-cd60-45b1-9100-3b469eceb31d',
        status: 'TOMORROW',
        todoIds: '',
      },
      {
        id: 6,
        userId: '62ac362a-cd60-45b1-9100-3b469eceb31d',
        status: 'NEXT',
        todoIds: '',
      },
      {
        id: 7,
        userId: '7d564bce-2b98-4a86-b5b3-a942e6241584',
        status: 'TODAY',
        todoIds: '',
      },
      {
        id: 8,
        userId: '7d564bce-2b98-4a86-b5b3-a942e6241584',
        status: 'TOMORROW',
        todoIds: '',
      },
      {
        id: 9,
        userId: '7d564bce-2b98-4a86-b5b3-a942e6241584',
        status: 'NEXT',
        todoIds: '',
      },
    ],
  });
};
