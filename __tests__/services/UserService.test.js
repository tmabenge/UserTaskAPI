const mongoose = require('mongoose');
const UserService = require('../../services/UserService');
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const config = require('../../config/config');

jest.mock('../../models/User');

jest.mock('bcrypt', () => ({ 
  hash: jest.fn(async (password, saltRounds) => `hashed-${password}`),
  compare: jest.fn()
}));


beforeAll(async () => {
  await mongoose.connect(config.database.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

beforeEach(async () => {
  await User.deleteMany({});
  jest.clearAllMocks();
});

describe('UserService', () => {
  let userId;
  const userData = {
    username: 'testuser',
    first_name: 'First',
    last_name: 'Last',
    password: 'password123',
    email: 'test@example.com',
    phone: '1234567890',
  };

  test('should register a new user', async () => {
    const mockUser = {
      _id: 'someMockId',
      ...userData
    };
  
    User.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockUser),
      toObject: jest.fn().mockReturnValue({
        _id: 'someMockId',
        username: userData.username,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        phone: userData.phone,
      })
    }));
  
    const user = await UserService.registerUser(userData);
  
    expect(User).toHaveBeenCalledWith({ ...userData, password: 'hashed-password123' });
    expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
    expect(user).toEqual({
      _id: 'someMockId',
      username: 'testuser',
      first_name: 'First',
      last_name: 'Last',
      email: 'test@example.com',
      phone: '1234567890',
    });
  });

  test('should not register a user with an existing username', async () => {
    User.findOne.mockResolvedValue({ username: userData.username }); // Simulate existing user

    await expect(UserService.registerUser(userData)).rejects.toThrow('Username already exists');
    expect(User.findOne).toHaveBeenCalledWith({ username: userData.username });
  });

  test('should log in a user with valid credentials', async () => {
    const mockUser = { _id: 'someMockId', ...userData, password: 'hashed-password123' };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);

    const token = await UserService.loginUser({
      username: userData.username,
      password: userData.password,
    });

    expect(User.findOne).toHaveBeenCalledWith({ username: userData.username });
    expect(bcrypt.compare).toHaveBeenCalledWith(userData.password, 'hashed-password123');
    expect(token).toBeDefined();
  });

  test('should not log in with an incorrect password', async () => {
    const mockUser = { _id: 'someMockId', ...userData, password: 'hashed-password123' };
    User.findOne.mockResolvedValue(mockUser);
  
    bcrypt.compare.mockResolvedValue(false); 
  
    await expect(UserService.loginUser({
      username: userData.username,
      password: 'wrongpassword', 
    })).rejects.toThrow('Incorrect password');
  
    expect(User.findOne).toHaveBeenCalledWith({ username: userData.username });
    expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashed-password123'); 
  });

  test('should update an existing user', async () => {
    const mockUser = { 
      _id: 'someMockId', 
      ...userData, 
      toObject: jest.fn().mockReturnValue({
        _id: 'someMockId',
        username: userData.username,
        first_name: 'UpdatedFirst',
        last_name: userData.last_name,
        email: userData.email,
        phone: userData.phone,
      })
    };
  
    User.findByIdAndUpdate.mockResolvedValue(mockUser);
  
    const updatedData = { first_name: 'UpdatedFirst' };
    const updatedUser = await UserService.updateUser(mockUser._id, updatedData);
  
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      mockUser._id,
      updatedData,
      { new: true }
    );
    expect(updatedUser).toEqual(mockUser.toObject());
  });

  test('should delete a user by ID', async () => {
    const mockUser = { 
      _id: 'someMockId', 
      ...userData,
      toObject: jest.fn().mockReturnValue({
        _id: 'someMockId',
        username: userData.username,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        phone: userData.phone
      })
    };
  
    User.findByIdAndDelete.mockResolvedValue(mockUser);
  
    const result = await UserService.deleteUserById(mockUser._id);
  
    expect(User.findByIdAndDelete).toHaveBeenCalledWith(mockUser._id);
    expect(result).toEqual(mockUser.toObject());
  });

  test('should get user by ID', async () => {
    const mockUser = { 
      _id: 'someMockId',
      ...userData, 
      toObject: jest.fn().mockReturnValue({
        _id: 'someMockId',
        username: userData.username,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        phone: userData.phone
      })
    };
  
    User.findById.mockResolvedValue(mockUser);
  
    const fetchedUser = await UserService.getUserById(mockUser._id);
  
    expect(User.findById).toHaveBeenCalledWith(mockUser._id);
    expect(fetchedUser).toEqual(mockUser.toObject());
  });

  test('should retrieve all users', async () => {
    const mockUsers = [{ _id: 'someMockId1', ...userData }, { _id: 'someMockId2', ...userData }];
    User.find.mockResolvedValue(mockUsers);

    const users = await UserService.getAllUsers();

    expect(User.find).toHaveBeenCalled();
    expect(users).toEqual(mockUsers);
  });
});