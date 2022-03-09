import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const todoOrder = async () => {
  await prisma.todoOrder.createMany({
    data: [
      {
        id: 1,
        uid: '5tHcvHXVTradwkofKQXPnq0VU0r0',
        status: 'TODAY',
        todoIds: '1,2,3,4',
      },
      {
        id: 2,
        uid: '5tHcvHXVTradwkofKQXPnq0VU0r0',
        status: 'TOMORROW',
        todoIds: '5,6,7,8',
      },
      {
        id: 3,
        uid: '5tHcvHXVTradwkofKQXPnq0VU0r0',
        status: 'NEXT',
        todoIds: '9,10,11,12',
      },
      {
        id: 4,
        uid: 'TradwkofKQXPnq0VU0r5tHcvHXV3',
        status: 'TODAY',
        todoIds: '13',
      },
      {
        id: 5,
        uid: 'TradwkofKQXPnq0VU0r5tHcvHXV3',
        status: 'TOMORROW',
        todoIds: '14',
      },
      {
        id: 6,
        uid: 'TradwkofKQXPnq0VU0r5tHcvHXV3',
        status: 'NEXT',
        todoIds: '15',
      },
      {
        id: 7,
        uid: 'Pnq0VU0r5tHcvHXVTradwkofKQX4',
        status: 'TODAY',
        todoIds: null,
      },
      {
        id: 8,
        uid: 'Pnq0VU0r5tHcvHXVTradwkofKQX4',
        status: 'TOMORROW',
        todoIds: null,
      },
      {
        id: 9,
        uid: 'Pnq0VU0r5tHcvHXVTradwkofKQX4',
        status: 'NEXT',
        todoIds: null,
      },
    ],
  });
};
