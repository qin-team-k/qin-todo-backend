import { userStub } from '../test/stubs/user.stub';

export const UserService = jest.fn().mockReturnValue({
  updateUser: jest.fn().mockResolvedValue(userStub()),
  uploadAvatarImage: jest.fn().mockResolvedValue(userStub()),
  deleteUser: jest.fn().mockResolvedValue(undefined),
});
