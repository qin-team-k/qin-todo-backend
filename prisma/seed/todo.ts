import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const todo = async () => {
  await prisma.todo.createMany({
    data: [
      {
        id: 1,
        userId: '4ff64eb1-c22a-4455-a50d-75cdc3c1e561',
        status: 'TODAY',
        done: false,
        content: '犬の散歩',
      },
      {
        id: 2,
        userId: '4ff64eb1-c22a-4455-a50d-75cdc3c1e561',
        status: 'TODAY',
        done: false,
        content: '畑の水やり',
      },
      {
        id: 3,
        userId: '4ff64eb1-c22a-4455-a50d-75cdc3c1e561',
        status: 'TODAY',
        done: false,
        content: '猪の罠回収',
      },
      {
        id: 4,
        userId: '4ff64eb1-c22a-4455-a50d-75cdc3c1e561',
        status: 'TODAY',
        done: false,
        content: '土間のDIY',
      },
      {
        id: 5,
        userId: '4ff64eb1-c22a-4455-a50d-75cdc3c1e561',
        status: 'TODAY',
        done: false,
        content: 'タンクのお掃除',
      },
      {
        id: 6,
        userId: '4ff64eb1-c22a-4455-a50d-75cdc3c1e561',
        status: 'TODAY',
        done: false,
        content: '北の国から録画',
      },
      {
        id: 7,
        userId: '4ff64eb1-c22a-4455-a50d-75cdc3c1e561',
        status: 'TODAY',
        done: false,
        content: 'サーフィンの練習',
      },
      {
        id: 8,
        userId: '4ff64eb1-c22a-4455-a50d-75cdc3c1e561',
        status: 'TODAY',
        done: false,
        content: '自己啓発本の読破',
      },
      {
        id: 9,
        userId: '4ff64eb1-c22a-4455-a50d-75cdc3c1e561',
        status: 'TODAY',
        done: false,
        content: 'クッキーのチョコチップ',
      },
      {
        id: 10,
        userId: '4ff64eb1-c22a-4455-a50d-75cdc3c1e561',
        status: 'TODAY',
        done: false,
        content: '壊れかけのレディオ',
      },
      {
        id: 11,
        userId: '4ff64eb1-c22a-4455-a50d-75cdc3c1e561',
        status: 'TODAY',
        done: false,
        content: 'マウスが壊れた',
      },
      {
        id: 12,
        userId: '4ff64eb1-c22a-4455-a50d-75cdc3c1e561',
        status: 'TODAY',
        done: false,
        content: 'ランニング',
      },
    ],
  });
};
