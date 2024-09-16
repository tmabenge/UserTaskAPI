const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: false },
  isAdmin: { type: Boolean, default: false },
},{ timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;