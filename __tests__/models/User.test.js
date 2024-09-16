const User = require('../../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

describe('User Model', () => {
  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost:27017/test-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  describe('create user', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User',
        password: 'password123', 
        email: 'test@example.com',
        phone: '1234567890',
      };
    
      const hashedPassword = await bcrypt.hash(userData.password, 10);
    
      const user = new User({
        ...userData, 
        password: hashedPassword,
      });
    
      try {
        await user.save();
        const savedUser = await User.findById(user._id);
    
        console.log('Saved User:', savedUser);
    
        expect(savedUser).toBeDefined();
        expect(savedUser.username).toEqual(userData.username);
        expect(savedUser.first_name).toEqual(userData.first_name);
        expect(savedUser.last_name).toEqual(userData.last_name);
        expect(savedUser.email).toEqual(userData.email);
        expect(savedUser.phone).toEqual(userData.phone);
        expect(savedUser.isAdmin).toEqual(false);
    
        const isPasswordMatch = await bcrypt.compare(userData.password, savedUser.password);
        expect(isPasswordMatch).toBe(true);
      } catch (error) {
        console.error('Error creating user:', error);
        throw error;
      }  
    });

    it('should create a user with default isAdmin value false', async () => {
      const userData = {
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User',
        password: 'password123',
        email: 'test@example.com',
      };

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = new User({
        ...userData,
        password: hashedPassword,
      });
      await user.save();

      const savedUser = await User.findById(user._id);

      expect(savedUser.isAdmin).toEqual(false);
    });
  });

  describe('update user', () => {
    let userId;

    beforeEach(async () => {
      const userData = {
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User',
        password: 'password123',
        email: 'test@example.com',
        phone: '1234567890',
      };

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = new User({
        ...userData,
        password: hashedPassword,
      });
      await user.save();
      userId = user._id;
    });

    it('should update a user with valid data', async () => {
      const updatedUserData = {
        first_name: 'UpdatedTest',
        last_name: 'UpdatedUser',
        phone: '9876543210', // Update phone
      };

      const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });

      expect(updatedUser).toBeDefined();
      expect(updatedUser.first_name).toEqual(updatedUserData.first_name);
      expect(updatedUser.last_name).toEqual(updatedUserData.last_name);
      expect(updatedUser.phone).toEqual(updatedUserData.phone); 
    });
  });

  describe('delete user', () => {
    let userId;

    beforeEach(async () => {
      const userData = {
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User',
        password: 'password123',
        email: 'test@example.com',
        phone: '1234567890',
      };

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = new User({
        ...userData,
        password: hashedPassword,
      });
      await user.save();
      userId = user._id;
    });

    it('should delete a user by ID', async () => {
      await User.findByIdAndDelete(userId);

      const deletedUser = await User.findById(userId);
      expect(deletedUser).toBeNull();
    });
  });
});