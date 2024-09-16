const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  date_time: { type: Date, required: true },
  status: {
    type: String,
    enum: [
      'Pending',
      'In Progress',
      'Completed',
      'Cancelled'
    ],
    default: 'Pending'
  },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: false },
  recurrence: { type: String, enum: ['daily', 'weekly', 'monthly'], default: null },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'], 
    default: 'Medium' 
  },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;