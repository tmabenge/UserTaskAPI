const validator = require('validator');

module.exports = (req, res, next) => {
  const { name, description, date_time, recurrence, priority, status } = req.body;

  if (!validator.isLength(name, { min: 1, max: 100 })) {
    return res.status(400).json({ message: 'Task name must be between 1 and 100 characters' });
  }

  if (description && !validator.isLength(description, { max: 500 })) {
    return res.status(400).json({ message: 'Description cannot exceed 500 characters' });
  }

  if (status && !['Pending', 'In Progress', 'Completed', 'Cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value. Allowed values: Pending, In Progress, Completed, Cancelled' });
  }

  if (!validator.isDate(date_time)) { 
    return res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD' });
  }

  if (recurrence && !['daily', 'weekly', 'monthly'].includes(recurrence)) {
    return res.status(400).json({ message: 'Invalid recurrence value. Allowed values: daily, weekly, monthly' });
  }

  if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
    return res.status(400).json({ message: 'Invalid priority value. Allowed values: Low, Medium, High' });
  }

  next();
};