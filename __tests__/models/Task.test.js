const Task = require('../../models/Task');
const mongoose = require('mongoose');

describe('Task Model', () => {
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

  describe('create task', () => {
    it('should create a new task with valid data', async () => {
      const taskData = {
        name: 'Test Task',
        description: 'This is a test task',
        date_time: new Date('2024-03-15T14:00:00'),
        user_id: new mongoose.Types.ObjectId(),
        location: 'Test Location',
        recurrence: 'weekly',
      };

      const task = new Task(taskData);
      await task.save();

      const savedTask = await Task.findById(task._id);

      expect(savedTask).toBeDefined();
      expect(savedTask.name).toEqual(taskData.name);
      expect(savedTask.description).toEqual(taskData.description);
      expect(savedTask.date_time).toEqual(taskData.date_time);
      expect(savedTask.user_id.toString()).toEqual(taskData.user_id.toString());
      expect(savedTask.location).toEqual(taskData.location);
      expect(savedTask.recurrence).toEqual(taskData.recurrence);
      expect(savedTask.status).toEqual('Pending'); 
    });

    it('should create a task with default status "Pending"', async () => {
      const taskData = {
        name: 'Test Task',
        description: 'This is a test task',
        date_time: new Date('2024-03-15T14:00:00'),
        user_id: new mongoose.Types.ObjectId(), 
        location: 'Test Location',
      };

      const task = new Task(taskData);
      await task.save();

      const savedTask = await Task.findById(task._id);
      expect(savedTask.status).toEqual('Pending');
    });

    it('should create a task with null recurrence if not provided', async () => {
      const taskData = {
        name: 'Test Task',
        description: 'This is a test task',
        date_time: new Date('2024-03-15T14:00:00'),
        user_id: new mongoose.Types.ObjectId(),
        location: 'Test Location',
      };

      const task = new Task(taskData);
      await task.save();

      const savedTask = await Task.findById(task._id);
      expect(savedTask.recurrence).toEqual(null);
    });
  });

  describe('update task', () => {
    let taskId;

    beforeEach(async () => {
      const taskData = {
        name: 'Test Task',
        description: 'This is a test task',
        date_time: new Date('2024-03-15T14:00:00'),
        user_id: new mongoose.Types.ObjectId(),
        location: 'Test Location',
      };

      const task = new Task(taskData);
      await task.save();
      taskId = task._id;
    });

    it('should update a task with valid data', async () => {
      const updatedTaskData = {
        name: 'Updated Test Task',
        description: 'This is an updated task',
        date_time: new Date('2024-03-16T10:00:00'),
        location: 'Updated Test Location',
        recurrence: 'daily',
      };

      const updatedTask = await Task.findByIdAndUpdate(taskId, updatedTaskData, { new: true });

      expect(updatedTask).toBeDefined();
      expect(updatedTask.name).toEqual(updatedTaskData.name);
      expect(updatedTask.description).toEqual(updatedTaskData.description);
      expect(updatedTask.date_time).toEqual(updatedTaskData.date_time);
      expect(updatedTask.location).toEqual(updatedTaskData.location);
      expect(updatedTask.recurrence).toEqual(updatedTaskData.recurrence);
    });
  });

  describe('delete task', () => {
    let taskId;

    beforeEach(async () => {
      const taskData = {
        name: 'Test Task',
        description: 'This is a test task',
        date_time: new Date('2024-03-15T14:00:00'),
        user_id: new mongoose.Types.ObjectId(),
        location: 'Test Location',
      };

      const task = new Task(taskData);
      await task.save();
      taskId = task._id;
    });

    it('should delete a task by ID', async () => {
      await Task.findByIdAndDelete(taskId);

      const deletedTask = await Task.findById(taskId);
      expect(deletedTask).toBeNull(); 
    });
  });
});