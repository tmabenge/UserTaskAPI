const express = require('express');
const mongoose = require('mongoose');
const schedule = require('node-schedule');
const config = require('./config/config');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const authenticateToken = require('./middleware/authenticateToken');
const swaggerConfig = require('./config/swagger');
const swaggerUi = require('swagger-ui-express');
const TaskService = require('./services/TaskService');

const app = express();

mongoose.connect(config.database.uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/users/:user_id/tasks', authenticateToken, taskRoutes);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig.swaggerSpecs));

// Scheduled Job
const rule = new schedule.RecurrenceRule();
rule.minute = new schedule.Range(0, 59, 1); 
schedule.scheduleJob(rule, async () => {
  try {
    await TaskService.markOverdueTasksAsCancelled(); 
    console.log(`[${new Date().toISOString()}] Cancelled overdue tasks.`);
  } catch (err) {
    console.error('Error marking overdue tasks as cancelled:', err);
  }
});

module.exports = app