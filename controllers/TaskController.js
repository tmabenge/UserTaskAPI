const taskService = require('../services/TaskService');

const taskController = {};

// POST /api/users/:user_id/tasks
taskController.postTask = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const task = await taskService.createTask(userId, req.body);
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(err.code || 500).json({ message: err.message || 'Failed to create task' });
  }
};

// PUT /api/users/:user_id/tasks/:task_id
taskController.putTask = async (req, res) => {
  try {
    const taskId = req.params.task_id;
    const updatedTask = await taskService.updateTask(taskId, req.body);
    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(err.code || 500).json({ message: err.message || 'Failed to update task' });
  }
};

// DELETE /api/users/:user_id/tasks/:task_id
taskController.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.task_id;
    await taskService.deleteTask(taskId);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(err.code || 500).json({ message: err.message || 'Failed to delete task' });
  }
};

// GET /api/users/:user_id/tasks/:task_id
taskController.getTask = async (req, res) => {
  try {
    const taskId = req.params.task_id;
    const task = await taskService.getTaskById(taskId);
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(err.code || 500).json({ message: err.message || 'Failed to get task' });
  }
};

// GET /api/users/:user_id/tasks
taskController.getTasks = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const tasks = await taskService.getTasksByUserId(userId, page, limit);

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(err.code || 500).json({ message: err.message || 'Failed to get tasks' });
  }
};

module.exports = taskController