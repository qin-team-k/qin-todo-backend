import {
  updatedUserStub,
  updatedAvatarImageStub,
} from '../test/stubs/user.stub';

export const UserService = jest.fn().mockReturnValue({
  updateUser: jest.fn().mockResolvedValue(updatedUserStub()),
  uploadAvatarImage: jest.fn().mockResolvedValue(updatedAvatarImageStub()),
  deleteUser: jest.fn().mockResolvedValue(undefined),
});
