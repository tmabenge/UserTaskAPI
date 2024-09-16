const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

class UserService {
  async registerUser(userData) {
    const { username, first_name, last_name, password, email, phone} = userData;

    const existingUser = await User.findOne({ username: userData.username });
    if (existingUser) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      first_name,
      last_name,
      password: hashedPassword,
      email,
      phone,
    });
    console.log(user);
    await user.save();
    return this.omitSensitiveData(user);
  }

  async loginUser(credentials) {
    const { username, password } = credentials;

    const user = await User.findOne({ username: username });
    if (!user) {
      throw new Error("User not found");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Incorrect password");
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, isAdmin: user.isAdmin },
      config.jwtSecret,
      { expiresIn: '1h' }
    );
    return token;
  }

  async updateUser(userId, updatedData) {
    // Prevent updating the isAdmin field by removing it from updatedData
    delete updatedData.isAdmin;

    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });
    if (!updatedUser) {
      throw new Error("User not found");
    }
    return this.omitSensitiveData(updatedUser);
  }

  async getUserById(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return this.omitSensitiveData(user);
  }

  async getAllUsers() {
    return await User.find();
  }

  async deleteUserById(userId) {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      throw new Error("User not found");
    }
    return this.omitSensitiveData(deletedUser);
  }

  omitSensitiveData(user) {
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }
}

module.exports = new UserService();
