const userService = require('../services/UserService');

const userController = {};

// POST /api/users/register
userController.postRegister = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    if (user) {
      res.status(201).json(user);
    } else {
      res.status(500).json({ message: 'Failed to create user' });
    }
  } catch (err) {
    console.error(err);
    res.status(err.code || 500).json({ message: err.message || 'Failed to create user' });
  }
};

// POST /api/users/login
userController.postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await userService.loginUser({ username, password });
    if (token) {
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(err.code || 401).json({ message: err.message || 'Invalid credentials' });
  }
};

// PUT /api/users/:id
userController.putUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await userService.updateUser(userId, req.body);
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(err.code || 500).json({ message: err.message || 'Failed to update user' });
  }
};

// GET /api/users
userController.getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(err.code || 500).json({ message: err.message || 'Failed to get users' });
  }
};

// GET /api/users/:id
userController.getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(err.code || 500).json({ message: err.message || 'Failed to get user' });
  }
};

userController.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await userService.deleteUserById(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(err.code || 500).json({ message: err.message || 'Failed to delete user' });
  }
};

module.exports = userController;