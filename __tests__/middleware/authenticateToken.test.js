const authenticateToken = require('../../middleware/authenticateToken');
const jwt = require('jsonwebtoken');
const { Request, Response } = require('jest-express');
const config = require('../../config/config');

jest.mock('jsonwebtoken');

describe('authenticateToken', () => {
  let req, res, next;

  beforeEach(() => {
    req = new Request();
    res = new Response();
    next = jest.fn(); 
  });

  it('should return a 401 Unauthorized response if no token is provided', async () => {
    await authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return a 403 Forbidden response if the token is invalid', async () => {
    const token = 'invalid_token';
    req.headers.authorization = `Bearer ${token}`;

    jwt.verify.mockImplementation((_token, _secret, callback) => {
      callback(new Error('Invalid token'));
    });

    await authenticateToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, config.jwtSecret, expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with the user data if the token is valid', async () => {
    const token = 'valid_token';
    const mockUser = { userId: '1234567890', username: 'testuser' }; 
    req.headers.authorization = `Bearer ${token}`;

    jwt.verify.mockImplementation((_token, secret, callback) => {
      callback(null, mockUser);
    });

    await authenticateToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, config.jwtSecret, expect.any(Function));
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(mockUser);
  });
});