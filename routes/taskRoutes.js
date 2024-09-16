const express = require("express");
const taskController = require("../controllers/TaskController");
const validateTask = require("../middleware/validateTask");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 * /api/users/{user_id}/tasks/{task_id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *       - in: path
 *         name: task_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Task ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the task
 *                 example: Updated Task
 *               description:
 *                 type: string
 *                 description: A description of the task
 *                 example: Updated description
 *               date_time:
 *                 type: string
 *                 format: date-time 
 *                 description: The due date and time of the task (YYYY-MM-DD format)
 *                 example: 2024-09-15
 *               status:
 *                 type: string
 *                 description: The status of the task
 *                 enum: [Pending, 'In Progress', Completed, Cancelled]
 *                 example: In Progress
 *               location:
 *                 type: string
 *                 description: The location of the task
 *                 example: Home
 *               recurrence:
 *                 type: string
 *                 description: Recurrence pattern (daily, weekly, monthly)
 *                 example: weekly
 *               priority:
 *                 type: string
 *                 description: Priority of the task (Low, Medium, High)
 *                 example: High
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request (invalid input)
 *       401:
 *         description: Unauthorized (not logged in)
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *       - in: path
 *         name: task_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized (not logged in)
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *       - in: path
 *         name: task_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized (not logged in)
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 * /api/users/{user_id}/tasks:
 *   post:
 *     summary: Create a new task for a user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
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
 *               name:
 *                 type: string
 *                 description: The name of the task
 *                 example: Test Task
 *               description:
 *                 type: string
 *                 description: A description of the task
 *                 example: A test task description
 *               date_time:
 *                 type: string
 *                 format: date-time 
 *                 description: The due date and time of the task (YYYY-MM-DD format)
 *                 example: 2024-03-15
 *               status:
 *                 type: string
 *                 description: The status of the task
 *                 enum: [Pending, 'In Progress', Completed, Cancelled]
 *                 example: In Progress
 *               location:
 *                 type: string
 *                 description: The location of the task
 *                 example: Home
 *               recurrence:
 *                 type: string
 *                 description: Recurrence pattern (daily, weekly, monthly)
 *                 example: weekly
 *               priority:
 *                 type: string
 *                 description: Priority of the task (Low, Medium, High)
 *                 example: High
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request (invalid input)
 *       401:
 *         description: Unauthorized (not logged in)
 *       500:
 *         description: Server error
 *   get:
 *     summary: Get all tasks for a user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of tasks for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized (not logged in)
 *       500:
 *         description: Server error
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Task ID
 *         name:
 *           type: string
 *           description: The name of the task
 *         description:
 *           type: string
 *           description: A description of the task
 *         date_time:
 *           type: string
 *           format: date-time
 *           description: The due date and time of the task
 *         status:
 *           type: string
 *           description: The status of the task (pending, in progress, completed, cancelled)
 *         user_id:
 *           type: string
 *           description: The ID of the user who created the task
 *         location:
 *           type: string
 *           description: The location of the task
 *         recurrence:
 *           type: string
 *           description: Recurrence pattern (daily, weekly, monthly)
 *         priority:
 *           type: string
 *           description: Priority of the task (Low, Medium, High)
 *       required:
 *         - name
 *         - date_time
 *         - user_id
 * securityDefinitions:
 *   bearerAuth:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 */

router.post("/", authenticateToken, validateTask, async (req, res) => {
  if (req.user.userId !== req.params.user_id && !req.user.isAdmin) {
    return res.json({ message: "Unauthorized: Cannot create another user's task" });
}
  await taskController.postTask(req, res);
});

router.put("/:task_id", authenticateToken, validateTask, async (req, res) => {
  if (req.user.userId !== req.params.user_id && !req.user.isAdmin) {
    return res.json({ message: "Unauthorized: Cannot update another user's task" });
}
  await taskController.putTask(req, res);
});

router.delete("/:task_id", authenticateToken, async (req, res) => {
  if (req.user.userId !== req.params.user_id && !req.user.isAdmin) {
    return res.json({ message: "Unauthorized: Cannot delete another user's task" });
  }
  await taskController.deleteTask(req, res);
});

router.get("/:task_id", authenticateToken, async (req, res) => {
  if (req.user.userId !== req.params.user_id && !req.user.isAdmin) {
    return res.json({ message: "Unauthorized: Cannot view another user's task" });
  }
  await taskController.getTask(req, res);
});

router.get("/", authenticateToken, async (req, res) => {
  await taskController.getTasks(req, res);
});

module.exports = router;