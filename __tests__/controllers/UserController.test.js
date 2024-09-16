const userController = require('../../controllers/UserController');
const userService = require('../../services/UserService');
const { Request, Response } = require('jest-express');

jest.mock('../../services/UserService'); 

describe('UserController', () => {
  let req, res;

  beforeEach(() => {
    req = new Request();
    res = new Response();
  });

  describe('postRegister', () => {
    it('should create a new user and return a 201 status', async () => {
      const userData = { username: 'testuser', first_name: 'Test', last_name: 'User', password: 'password123', email: 'test@example.com' };
      const mockUser = { _id: 'abcdef1234567890', ...userData }; // Mock user data

      req.body = userData;

      userService.registerUser.mockResolvedValue(mockUser);

      await userController.postRegister(req, res);

      expect(userService.registerUser).toHaveBeenCalledWith(userData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should handle errors during user creation', async () => {
      const userData = { username: 'testuser', first_name: 'Test', last_name: 'User', password: 'password123', email: 'test@example.com' };
      const errorMessage = 'Failed to create user';

      req.body = userData;

      userService.registerUser.mockRejectedValue(new Error(errorMessage));

      await userController.postRegister(req, res);

      expect(userService.registerUser).toHaveBeenCalledWith(userData);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('postLogin', () => {
    it('should log in a user and return a JWT token', async () => {
      const credentials = { username: 'testuser', password: 'password123' };
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImlhdCI6MTY3OTI2NDM0N30.7lZ5-y0Zq56V2p7u8p1J7nN6B9-w9X3h12x7Qv2eRk';

      req.body = credentials;

      userService.loginUser.mockResolvedValue(mockToken);

      await userController.postLogin(req, res);

      expect(userService.loginUser).toHaveBeenCalledWith(credentials);
      expect(res.json).toHaveBeenCalledWith({ token: mockToken });
    });

    it('should handle invalid login credentials', async () => {
      const credentials = { username: 'testuser', password: 'password123' };
      const errorMessage = 'Invalid credentials';

      req.body = credentials;

      userService.loginUser.mockRejectedValue(new Error(errorMessage));

      await userController.postLogin(req, res);

      expect(userService.loginUser).toHaveBeenCalledWith(credentials);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('putUser', () => {
    it('should update a user and return the updated user', async () => {
      const userId = '1234567890';
      const updatedUserData = { first_name: 'UpdatedTest', last_name: 'UpdatedUser' };
      const mockUpdatedUser = { _id: userId, ...updatedUserData };

      req.params.id = userId;
      req.body = updatedUserData;

      userService.updateUser.mockResolvedValue(mockUpdatedUser);

      await userController.putUser(req, res);

      expect(userService.updateUser).toHaveBeenCalledWith(userId, updatedUserData);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedUser);
    });

    it('should handle errors during user update', async () => {
      const userId = '1234567890';
      const updatedUserData = { first_name: 'UpdatedTest', last_name: 'UpdatedUser' };
      const errorMessage = 'Failed to update user';

      req.params.id = userId;
      req.body = updatedUserData;

      userService.updateUser.mockRejectedValue(new Error(errorMessage));

      await userController.putUser(req, res);

      expect(userService.updateUser).toHaveBeenCalledWith(userId, updatedUserData);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('getUsers', () => {
    it('should get all users and return a 200 status', async () => {
      const mockUsers = [
        { _id: 'abcdef1234567890', username: 'testuser1', first_name: 'Test1', last_name: 'User1', password: 'password123', email: 'test1@example.com' },
        { _id: '9876543210abcdef', username: 'testuser2', first_name: 'Test2', last_name: 'User2', password: 'password456', email: 'test2@example.com' },
      ];

      userService.getAllUsers.mockResolvedValue(mockUsers);

      await userController.getUsers(req, res);

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle errors during user retrieval', async () => {
      const errorMessage = 'Failed to get users';

      userService.getAllUsers.mockRejectedValue(new Error(errorMessage));

      await userController.getUsers(req, res);

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('getUser', () => {
    it('should get a user by ID and return a 200 status', async () => {
      const userId = '1234567890';
      const mockUser = { _id: userId, username: 'testuser', first_name: 'Test', last_name: 'User', password: 'password123', email: 'test@example.com' };

      req.params.id = userId;

      userService.getUserById.mockResolvedValue(mockUser);

      await userController.getUser(req, res);

      expect(userService.getUserById).toHaveBeenCalledWith(userId);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should handle errors during user retrieval', async () => {
      const userId = '1234567890';
      const errorMessage = 'Failed to get user';

      req.params.id = userId;

      userService.getUserById.mockRejectedValue(new Error(errorMessage));

      await userController.getUser(req, res);

      expect(userService.getUserById).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return a 200 status', async () => {
      const userId = '1234567890';

      req.params.id = userId;

      userService.deleteUserById.mockResolvedValue();

      await userController.deleteUser(req, res);

      expect(userService.deleteUserById).toHaveBeenCalledWith(userId);
      expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });

    it('should handle errors during user deletion', async () => {
      const userId = '1234567890';
      const errorMessage = 'Failed to delete user';

      req.params.id = userId;

      userService.deleteUserById.mockRejectedValue(new Error(errorMessage));

      await userController.deleteUser(req, res);

      expect(userService.deleteUserById).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});