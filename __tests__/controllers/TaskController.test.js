const taskController = require('../../controllers/TaskController');
const taskService = require('../../services/TaskService');
const { Request, Response } = require('jest-express');

jest.mock('../../services/TaskService');

describe('TaskController', () => {
  let req, res;

  beforeEach(() => {
    req = new Request();
    res = new Response();
  });

  describe('postTask', () => {
    it('should create a new task and return a 201 status', async () => {
      const userId = '1234567890';
      const taskData = { name: 'Test Task', description: 'Test task description', date_time: '2024-03-15T14:00:00', recurrence: 'weekly' };
      const mockTask = { _id: 'abcdef1234567890', ...taskData };

      req.params.user_id = userId;
      req.body = taskData;

      taskService.createTask.mockResolvedValue(mockTask);

      await taskController.postTask(req, res);

      expect(taskService.createTask).toHaveBeenCalledWith(userId, taskData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it('should handle errors during task creation', async () => {
      const userId = '1234567890';
      const taskData = { name: 'Test Task', description: 'Test task description', date_time: '2024-03-15T14:00:00', recurrence: 'weekly' };
      const errorMessage = 'Failed to create task';

      req.params.user_id = userId;
      req.body = taskData;

      taskService.createTask.mockRejectedValue(new Error(errorMessage));

      await taskController.postTask(req, res);

      expect(taskService.createTask).toHaveBeenCalledWith(userId, taskData);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('putTask', () => {
    it('should update a task and return a 200 status', async () => {
      const taskId = 'abcdef1234567890';
      const updatedTaskData = { name: 'Updated Task', description: 'Updated task description' };
      const mockUpdatedTask = { _id: taskId, ...updatedTaskData };

      req.params.task_id = taskId;
      req.body = updatedTaskData;

      taskService.updateTask.mockResolvedValue(mockUpdatedTask);

      await taskController.putTask(req, res);

      expect(taskService.updateTask).toHaveBeenCalledWith(taskId, updatedTaskData); 
      expect(res.json).toHaveBeenCalledWith(mockUpdatedTask);
    });

    it('should handle errors during task update', async () => {
      const taskId = 'abcdef1234567890';
      const updatedTaskData = { name: 'Updated Task', description: 'Updated task description' };
      const errorMessage = 'Failed to update task';

      req.params.task_id = taskId;
      req.body = updatedTaskData;

      taskService.updateTask.mockRejectedValue(new Error(errorMessage));

      await taskController.putTask(req, res);

      expect(taskService.updateTask).toHaveBeenCalledWith(taskId, updatedTaskData);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task and return a 200 status', async () => {
      const taskId = 'abcdef1234567890';

      req.params.task_id = taskId;

      taskService.deleteTask.mockResolvedValue();

      await taskController.deleteTask(req, res);

      expect(taskService.deleteTask).toHaveBeenCalledWith(taskId);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task deleted successfully' });
    });

    it('should handle errors during task deletion', async () => {
      const taskId = 'abcdef1234567890';
      const errorMessage = 'Failed to delete task';

      req.params.task_id = taskId;

      taskService.deleteTask.mockRejectedValue(new Error(errorMessage));

      await taskController.deleteTask(req, res);

      expect(taskService.deleteTask).toHaveBeenCalledWith(taskId);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('getTask', () => {
    it('should get a task and return a 200 status', async () => {
      const taskId = 'abcdef1234567890';
      const mockTask = { _id: taskId, name: 'Test Task', description: 'Test task description', date_time: '2024-03-15T14:00:00', recurrence: 'weekly' };

      req.params.task_id = taskId;

      taskService.getTaskById.mockResolvedValue(mockTask);

      await taskController.getTask(req, res);

      expect(taskService.getTaskById).toHaveBeenCalledWith(taskId);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it('should handle errors during task retrieval', async () => {
      const taskId = 'abcdef1234567890';
      const errorMessage = 'Failed to get task';

      req.params.task_id = taskId;

      taskService.getTaskById.mockRejectedValue(new Error(errorMessage));

      await taskController.getTask(req, res);

      expect(taskService.getTaskById).toHaveBeenCalledWith(taskId);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('getTasks', () => {
    it('should get all tasks for a user and return a 200 status', async () => {
      const userId = '1234567890';
      const page = 1;
      const limit = 10;
      const mockTasks = [
        { _id: 'abcdef1234567890', name: 'Test Task 1', description: 'Test task description 1', date_time: '2024-03-15T14:00:00', recurrence: 'weekly' },
        { _id: '9876543210abcdef', name: 'Test Task 2', description: 'Test task description 2', date_time: '2024-03-16T10:00:00', recurrence: 'daily' },
      ];

      req.params.user_id = userId;
      req.query.page = page;
      req.query.limit = limit;

      taskService.getTasksByUserId.mockResolvedValue(mockTasks);

      await taskController.getTasks(req, res);

      expect(taskService.getTasksByUserId).toHaveBeenCalledWith(userId, page, limit);
      expect(res.json).toHaveBeenCalledWith(mockTasks);
    });

    it('should handle errors during task retrieval', async () => {
      const userId = '1234567890';
      const errorMessage = 'Failed to get tasks';

      req.params.user_id = userId;

      taskService.getTasksByUserId.mockRejectedValue(new Error(errorMessage));

      await taskController.getTasks(req, res);

      expect(taskService.getTasksByUserId).toHaveBeenCalledWith(userId, 1, 10); 
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});