const mongoose = require('mongoose');
const TaskService = require('../../services/TaskService');
const Task = require('../../models/Task');
const config = require('../../config/config');

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
  await Task.deleteMany({});
});

describe('TaskService', () => {
  let userId;

  beforeEach(() => {
    userId = new mongoose.Types.ObjectId();
  });

  test('should create a new task', async () => {
    const taskData = {
      name: 'Test Task',
      description: 'This is a test task',
      date_time: new Date(),
      recurrence: null
    };

    const task = await TaskService.createTask(userId, taskData);

    expect(task).toHaveProperty('_id');
    expect(task.name).toBe(taskData.name);
    expect(task.status).toBe('Pending');
  });

  test('should update an existing task', async () => {
    const taskData = {
      name: 'Test Task',
      description: 'This is a test task',
      date_time: new Date(),
      recurrence: null
    };

    const task = await TaskService.createTask(userId, taskData);
    const updatedData = { status: 'Completed' };

    const updatedTask = await TaskService.updateTask(task._id, updatedData);

    expect(updatedTask.status).toBe('Completed');
  });

  test('should delete an existing task', async () => {
    const taskData = {
      name: 'Test Task',
      description: 'This is a test task',
      date_time: new Date(),
      recurrence: null
    };

    const task = await TaskService.createTask(userId, taskData);
    const deletedTask = await TaskService.deleteTask(task._id);

    expect(deletedTask).toHaveProperty('_id', task._id);

    const fetchedTask = await Task.findById(task._id);
    expect(fetchedTask).toBeNull();
  });

  test('should retrieve a task by ID', async () => {
    const taskData = {
      name: 'Test Task',
      description: 'This is a test task',
      date_time: new Date(),
      recurrence: null
    };

    const task = await TaskService.createTask(userId, taskData);
    const fetchedTask = await TaskService.getTaskById(task._id);

    expect(fetchedTask.name).toBe(taskData.name);
  });

  test('should retrieve tasks by user ID', async () => {
    const taskData1 = {
      name: 'Test Task 1',
      description: 'This is the first test task',
      date_time: new Date(),
      recurrence: null
    };
    
    const taskData2 = {
      name: 'Test Task 2',
      description: 'This is the second test task',
      date_time: new Date(),
      recurrence: null
    };

    await TaskService.createTask(userId, taskData1);
    await TaskService.createTask(userId, taskData2);

    const tasks = await TaskService.getTasksByUserId(userId, 1, 10);
    expect(tasks.length).toBe(2);
  });
});