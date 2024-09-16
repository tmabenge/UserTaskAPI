const dotenv = require('dotenv');
dotenv.config(); 

module.exports = {
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/your-db-name',
  },
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
};
