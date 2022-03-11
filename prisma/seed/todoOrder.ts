import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const todoOrder = async () => {
  await prisma.todoOrder.createMany({
    data: [
      {
        id: 1,
        uuid: '4ff64eb1-c22a-4455-a50d-75cdc3c1e561',
        status: 'TODAY',
        todoIds: '1,2,3,4',
      },
      {
        id: 2,
        uuid: '4ff64eb1-c22a-4455-a50d-75cdc3c1e561',
        status: 'TOMORROW',
        todoIds: '5,6,7,8',
      },
      {
        id: 3,
        uuid: '4ff64eb1-c22a-4455-a50d-75cdc3c1e561',
        status: 'NEXT',
        todoIds: '9,10,11,12',
      },
      {
        id: 4,
        uuid: '62ac362a-cd60-45b1-9100-3b469eceb31d',
        status: 'TODAY',
        todoIds: '13',
      },
      {
        id: 5,
        uuid: '62ac362a-cd60-45b1-9100-3b469eceb31d',
        status: 'TOMORROW',
        todoIds: '14',
      },
      {
        id: 6,
        uuid: '62ac362a-cd60-45b1-9100-3b469eceb31d',
        status: 'NEXT',
        todoIds: '15',
      },
      {
        id: 7,
        uuid: '7d564bce-2b98-4a86-b5b3-a942e6241584',
        status: 'TODAY',
        todoIds: null,
      },
      {
        id: 8,
        uuid: '7d564bce-2b98-4a86-b5b3-a942e6241584',
        status: 'TOMORROW',
        todoIds: null,
      },
      {
        id: 9,
        uuid: '7d564bce-2b98-4a86-b5b3-a942e6241584',
        status: 'NEXT',
        todoIds: null,
      },
    ],
  });
};
