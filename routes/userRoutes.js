const express = require("express");
const userController = require("../controllers/UserController");
const validateUser = require("../middleware/validateUser");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *                 example: testuser
 *               first_name:
 *                 type: string
 *                 description: The first name of the user
 *                 example: Test
 *               last_name:
 *                 type: string
 *                 description: The last name of the user
 *                 example: User
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: Password1234!
 *               email:
 *                 type: string
 *                 description: The email of the user
 *                 example: test@test.com
 *               phone:
 *                 type: string
 *                 description: The phone of the user
 *                 example: 0123456789
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request (invalid input)
 *       500:
 *         description: Server error
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *                 example: testuser
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: Password1234!
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       401:
 *         description: Unauthorized (invalid credentials)
 * /api/users/{id}:
 *   put:
 *     summary: Update a user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *                 example: testuser
 *               first_name:
 *                 type: string
 *                 description: The first name of the user
 *                 example: UpdatedTest
 *               last_name:
 *                 type: string
 *                 description: The last name of the user
 *                 example: UpdatedUser
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: Password1234!
 *               email:
 *                 type: string
 *                 description: The email of the user
 *                 example: test@test.com
 *               phone:
 *                 type: string
 *                 description: The phone of the user
 *                 example: 0123456789
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (not logged in)
 *       403:
 *         description: Forbidden (cannot update another user's profile)
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized (not logged in)
 *       403:
 *         description: Forbidden (not authorized to delete this user)
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (not logged in)
 *       500:
 *         description: Server error
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *         username:
 *           type: string
 *           description: The username of the user
 *         first_name:
 *           type: string
 *           description: The first name of the user
 *         last_name:
 *           type: string
 *           description: The last name of the user
 *         password:
 *           type: string
 *           description: The password of the user (hashed)
 *         email:
 *           type: string
 *           description: The email of the user
 *         phone:
 *           type: string
 *           description: The phone of the user
 *         createdAt:
 *           type: string
 *           description: User created date
 *         updatedAt:
 *           type: string
 *           description: User updated date
 *       required:
 *         - username
 *         - first_name
 *         - last_name
 *         - password
 *         - email
 * securityDefinitions:
 *   bearerAuth:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 */

router.post("/register", validateUser, async (req, res) => {
  await userController.postRegister(req, res);
});

router.post("/login", async (req, res) => {
  await userController.postLogin(req, res);
});

router.put("/:id", authenticateToken, async (req, res) => {
  if (req.user.userId !== req.params.id && !req.user.isAdmin) {
    return res.json({ message: "Unauthorized: Cannot update another user" }); 
  }
  await userController.putUser(req, res);
});

router.get("/", authenticateToken, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.json({ message: "Unauthorized: Only administrators can view all users" }); 
  }
  await userController.getUsers(req, res);
});

router.get("/:id", authenticateToken, async (req, res) => {
  if (req.user.userId !== req.params.id && !req.user.isAdmin) {
    return res.json({ message: "Unauthorized: Cannot view another user's profile" }); 
  }
  await userController.getUser(req, res);
});

router.delete("/:id", authenticateToken, async (req, res) => {
  if (req.user.userId !== req.params.id && !req.user.isAdmin) {
    return res.json({ message: "Unauthorized: Cannot delete another user's account" }); 
  }
  await userController.deleteUser(req, res);
});


module.exports = router;
