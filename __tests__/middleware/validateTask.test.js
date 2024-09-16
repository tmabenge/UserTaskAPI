const validateTask = require('../../middleware/validateTask');
const { Request, Response } = require('jest-express');

describe('validateTask', () => {
  let req, res, next;

  beforeEach(() => {
    req = new Request();
    res = new Response();
    next = jest.fn();
  });

  describe('valid task data', () => {
    it('should call next if all fields are valid', async () => {
      const validTaskData = {
        name: 'Test Task',
        description: 'This is a test task description',
        date_time: '2024-03-15',
        recurrence: 'weekly',
      };

      req.body = validTaskData;

      await validateTask(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('invalid task name', () => {
    it('should return a 400 error if task name is too short', async () => {
      const invalidTaskData = {
        name: '', 
        description: 'This is a test task description',
        date_time: '2024-03-15',
        recurrence: 'weekly',
      };

      req.body = invalidTaskData;

      await validateTask(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task name must be between 1 and 100 characters' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return a 400 error if task name is too long', async () => {
      const invalidTaskData = {
        name: 'This task name is extremely long and exceeds the character limit of 100 characters, which can be quite challenging in scenarios requiring brevity', 
        description: 'This is a test task description',
        date_time: '2024-03-15',
        recurrence: 'weekly',
      };

      req.body = invalidTaskData;

      await validateTask(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ message: 'Task name must be between 1 and 100 characters' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('invalid description', () => {
    it('should return a 400 error if description exceeds character limit', async () => {
      const invalidTaskData = {
        name: 'Test Task',
        description: 'This description is extremely long and exceeds the character limit of 500. It is much longer than the allowed 500 characters, making it necessary to condense the information while ensuring clarity and relevance. Balancing detail with conciseness can be challenging but is essential to meet requirements without losing important content that the reader needs to understand the main points and context effectively. Reducing wordiness can improve flow and focus, ensuring the message remains impactful and within limits.', 
        date_time: '2024-03-15',
        recurrence: 'weekly',
      };

      req.body = invalidTaskData;

      await validateTask(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Description cannot exceed 500 characters' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('invalid date_time', () => {
    it('should return a 400 error if date_time is invalid', async () => {
      const invalidTaskData = {
        name: 'Test Task',
        description: 'This is a test task description',
        date_time: '2024-03-15 14:00:00',
        recurrence: 'weekly',
      };

      req.body = invalidTaskData;

      await validateTask(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid date format. Please use YYYY-MM-DD' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('invalid recurrence', () => {
    it('should return a 400 error if recurrence is invalid', async () => {
      const invalidTaskData = {
        name: 'Test Task',
        description: 'This is a test task description',
        date_time: '2024-03-15',
        recurrence: 'dailyy',
      };

      req.body = invalidTaskData;

      await validateTask(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid recurrence value. Allowed values: daily, weekly, monthly' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});