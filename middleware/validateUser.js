const validator = require('validator');

module.exports = (req, res, next) => {
  const { username, first_name, last_name, password, email, phone } = req.body;

  if (!validator.isLength(username, { min: 3, max: 20 })) {
    return res.status(400).json({ message: 'Username must be between 3 and 20 characters' });
  }

  if (!validator.isLength(first_name, { min: 1, max: 50 })) {
    return res.status(400).json({ message: 'First name must be between 1 and 50 characters' });
  }

  if (!validator.isLength(last_name, { min: 1, max: 50 })) {
    return res.status(400).json({ message: 'Last name must be between 1 and 50 characters' });
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({ message: 'Password must be strong (at least 8 characters, with at least one uppercase, one lowercase, one number, and one special character)' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  if (phone) {
    if (!validator.isMobilePhone(phone)) { 
      return res.status(400).json({ message: 'Invalid phone number' });
    }
  }

  next();
};