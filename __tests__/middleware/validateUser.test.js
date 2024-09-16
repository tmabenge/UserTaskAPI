const validateUser = require('../../middleware/validateUser');
const { Request, Response } = require('jest-express');

describe('validateUser', () => {
  let req, res, next;

  beforeEach(() => {
    req = new Request();
    res = new Response();
    next = jest.fn();
  });

  describe('valid user data', () => {
    it('should call next if all fields are valid', async () => {
      const validUserData = {
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User',
        password: 'Password123!',
        email: 'test@example.com',
      };

      req.body = validUserData;

      await validateUser(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('invalid username', () => {
    it('should return a 400 error if username is too short', async () => {
      const invalidUserData = {
        username: 'te', // Too short
        first_name: 'Test',
        last_name: 'User',
        password: 'Password123!',
        email: 'test@example.com',
      };

      req.body = invalidUserData;

      await validateUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Username must be between 3 and 20 characters' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return a 400 error if username is too long', async () => {
      const invalidUserData = {
        username: 'ThisUsernameIsTooLongAndExceedsTheCharacterLimitOf20', // Too long
        first_name: 'Test',
        last_name: 'User',
        password: 'Password123!',
        email: 'test@example.com',
      };

      req.body = invalidUserData;

      await validateUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Username must be between 3 and 20 characters' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('invalid first name', () => {
    it('should return a 400 error if first name is too long', async () => {
      const invalidUserData = {
        username: 'testuser',
        first_name: 'ThisFirstNameIsTooLongAndExceedsTheCharacterLimitOf50', // Too long
        last_name: 'User',
        password: 'Password123!',
        email: 'test@example.com',
      };

      req.body = invalidUserData;

      await validateUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'First name must be between 1 and 50 characters' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('invalid last name', () => {
    it('should return a 400 error if last name is too long', async () => {
      const invalidUserData = {
        username: 'testuser',
        first_name: 'Test',
        last_name: 'ThisLastNameIsTooLongAndExceedsTheCharacterLimitOf50', // Too long
        password: 'Password123!',
        email: 'test@example.com',
      };

      req.body = invalidUserData;

      await validateUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Last name must be between 1 and 50 characters' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('invalid password', () => {
    it('should return a 400 error if password is not strong enough', async () => {
      const invalidUserData = {
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User',
        password: 'password', // Not strong enough
        email: 'test@example.com',
      };

      req.body = invalidUserData;

      await validateUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Password must be strong (at least 8 characters, with at least one uppercase, one lowercase, one number, and one special character)' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('invalid email', () => {
    it('should return a 400 error if email is invalid', async () => {
      const invalidUserData = {
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User',
        password: 'Password123!',
        email: 'test.example.com', // Invalid email format
      };

      req.body = invalidUserData;

      await validateUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email address' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});