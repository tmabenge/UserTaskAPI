const Task = require('../models/Task');
const schedule = require('node-schedule');

class TaskService {
  async createTask(userId, taskData) {
    const { name, description, date_time, recurrence, priority, location, status } = taskData;
    const task = new Task({
      name,
      description,
      date_time,
      user_id: userId,
      recurrence,
      priority,
      location, 
      status,
    });
    await task.save();

    if (recurrence) {
      const scheduleRule = this.createScheduleRule(recurrence);
      if (scheduleRule) {
        schedule.scheduleJob(scheduleRule, async () => {
          try {
            const newTask = new Task({ ...taskData, status: "pending" });
            await newTask.save();
            console.log("Recurring task scheduled:", newTask);
          } catch (err) {
            console.error("Error creating recurring task:", err);
          }
        });
      }
    }

    return task;
  }

  createScheduleRule(recurrence) {
    const scheduleRule = new schedule.RecurrenceRule();
    const recurrenceParts = recurrence.split(" ");

    if (recurrenceParts[0] === "daily") {
      scheduleRule.hour = 0;
    } else if (recurrenceParts[0] === "weekly") {
      scheduleRule.dayOfWeek = [0, 2, 4];
    } else if (recurrenceParts[0] === "monthly") {
      scheduleRule.date = new schedule.Range(1, 28, 1);
    } else {
      return null;
    }

    return scheduleRule;
  }

  async updateTask(taskId, updatedData) {
    const updatedTask = await Task.findByIdAndUpdate(taskId, updatedData, {
      new: true,
    });
    if (!updatedTask) {
      throw new Error("Task not found");
    }
    return updatedTask;
  }

  async deleteTask(taskId) {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      throw new Error("Task not found");
    }
    return deletedTask;
  }

  async getTaskById(taskId) {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    return task;
  }

  async getTasksByUserId(userId, page, limit) {
    try {
      const skip = (page - 1) * limit;
      const tasks = await Task.find({ user_id: userId })
        .skip(skip)
        .limit(limit);
      return tasks;
    } catch (err) {
      throw err;
    }
  }

  async markOverdueTasksAsCancelled() {
    const now = new Date();
    const pendingTasks = await Task.find({ 
      status: 'Pending', 
      date_time: { $lt: now } 
    });

    for (const task of pendingTasks) {
      console.log(`Cancelling task: ${task.name} (ID: ${task._id})`);
      task.status = 'Cancelled';
      await task.save();
    }
  }

}

module.exports = new TaskService();