import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const user = async () => {
  await prisma.user.createMany({
    data: [
      {
        id: '4ff64eb1-c22a-4455-a50d-75cdc3c1e561',
        username: 'John Doe',
        email: 'john@example.com',
        avatarUrl:
          'https://gravatar.com/avatar/3cb5628734a944573d67a5871b1dcbfb?s=400&d=robohash&r=x',
      },
      {
        id: '62ac362a-cd60-45b1-9100-3b469eceb31d',
        username: 'Sam Smith',
        email: 'sam@yahoo.co.jp',
        avatarUrl:
          'https://gravatar.com/avatar/74c7e4e5834719babfb22bb40fe20e1b?s=400&d=robohash&r=x',
      },
      {
        id: '7d564bce-2b98-4a86-b5b3-a942e6241584',
        username: 'Tomas Cruise',
        email: 'tom@gmail.com',
        avatarUrl:
          'https://gravatar.com/avatar/2712b6493c3684cb6f7c5c0ebd580a37?s=400&d=robohash&r=x',
      },
    ],
  });
};
