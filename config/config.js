const dotenv = require('dotenv');
dotenv.config(); 

module.exports = {
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/user-task-db',
  },
  jwtSecret: process.env.JWT_SECRET || '331d2fce5d6dd2767cb69b08c5d41b26c931ad89ec9fb35632ce9a14e1ee2433',
};