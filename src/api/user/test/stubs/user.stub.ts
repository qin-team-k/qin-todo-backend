import { User } from '@prisma/client';

/**
 * Objectで作成してしまうと、どこかでmutateされた場合、
 * 予測不能な振る舞いを起こす可能性があるので関数で定義する。
 * userStub関数を呼び出すたびに新しいユーザーが提供される。
 * その新たに提供されたユーザーは他のtestでは共有されない。
 */
export const userStub = (): User => {
  return {
    id: 'eb14ff64-a2c2-4455-0da5-c3c1e575cd62',
    uid: 'ofKQXPnq0VUwk0r15tHcvHXVTrad',
    username: 'John Conner',
    email: 'john@skynet.com',
    avatarUrl:
      'https://gravatar.com/avatar/3cb5628734a944573d67a5871b1dcbfb?s=400&d=robohash&r=x',
    createdAt: new Date('2020-06-01T00:00:00.000Z'),
    updatedAt: new Date('2020-06-01T00:00:00.000Z'),
  };
};

export const updatedUserStub = (): User => {
  return {
    id: 'eb14ff64-a2c2-4455-0da5-c3c1e575cd62',
    uid: 'ofKQXPnq0VUwk0r15tHcvHXVTrad',
    username: 'updated username',
    email: 'john@skynet.com',
    avatarUrl:
      'https://gravatar.com/avatar/3cb5628734a944573d67a5871b1dcbfb?s=400&d=robohash&r=x',
    createdAt: new Date('2020-06-01T00:00:00.000Z'),
    updatedAt: new Date('2020-06-01T00:00:00.000Z'),
  };
};

export const updatedAvatarImageStub = (): User => {
  return {
    id: 'eb14ff64-a2c2-4455-0da5-c3c1e575cd62',
    uid: 'ofKQXPnq0VUwk0r15tHcvHXVTrad',
    username: 'John Conner',
    email: 'john@skynet.com',
    avatarUrl:
      'https://gravatar.com/avatar/updated3cb5628734a944573d67a587asdfasdfafb?s=400&d=robohash&r=x',
    createdAt: new Date('2020-06-01T00:00:00.000Z'),
    updatedAt: new Date('2020-06-01T00:00:00.000Z'),
  };
};
