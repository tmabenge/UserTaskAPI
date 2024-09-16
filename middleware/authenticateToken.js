const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ message: 'Unauthorized: No token provided' });

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ message: 'Unauthorized: Invalid token' });

    req.user = user;
    next(); 
  });
};