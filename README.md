# User Task Management App

This repository contains a Node.js application designed to manage users and their tasks. It leverages the Express framework and MongoDB for data persistence, incorporating various best practices.

## Key Features

### User Management
- **User Registration and Authentication:**
  - Register and authenticate users using JWT.
  - Login users with JWT.
- **Profile Management:**
  - Update user profile (by the user or admin).
  - Delete user account (by the user or admin).
  - Retrieve all users (admin only).
  - Retrieve user by ID (user or admin).

### Task Management
- **Task Operations:**
  - Create tasks with due dates, descriptions, status, recurrence, location, and priority.
  - Update tasks (by user or admin).
  - Delete tasks (by user or admin).
  - Retrieve tasks by ID (user or admin).
  - Retrieve all tasks for a user (user or admin).
  - Scheduled job for updating task status to cancel overdue tasks.

## Getting Started

1. **Download MongoDB:** 
   - Download and install MongoDB from [here](https://www.mongodb.com/download-center).
   - Follow the installation instructions for your operating system.

2. **Create the Database:**
   - Once MongoDB is set up and running, create a new database `your-db-name` using the MongoDB shell or a GUI tool.

3. **Clone the Repository:** 
   ```bash
   git clone https://github.com/tmabenge/UserTaskAPI.git
   ```

4. **Installation**
   ```bash
   cd usertaskapi
   npm install
   ```

5. **Set Up Environment Variables:**
   - Create a `.env` file in the root directory and configure the following variables:
     ```
     MONGODB_URI=mongodb://localhost:27017/your-db-name
     JWT_SECRET=your-secret-key
     ```

6. **Start the Server:**
   ```bash
   npm start
   ```

7. **API Documentation:**
   - Access the Swagger UI at `http://localhost:3000/api-docs` for interactive API documentation.
   - Use Postman or any REST client to interact with the API endpoints.

8. **Scheduled Job:**
   - The application includes a daily scheduled job to cancel overdue tasks.

9. **Future Developments:**
   - Notifications (Strategy Pattern): Implement a notification system using a strategy pattern for flexible delivery of:
     - Emails (using templates)
     - Push notifications

## API Endpoints

### User Endpoints

#### POST /api/users/register
Register a new user.

**Request Body**
```json
{
  "username": "testuser",
  "first_name": "Test",
  "last_name": "User",
  "password": "Password1234!",
  "email": "test@test.com",
  "phone": "0123456789"
}
```

**Responses**
- 201 Created: User successfully created (returns user data without the password).
- 400 Bad Request: Invalid input.
- 500 Internal Server Error: Server error.

#### POST /api/users/login
Login a user.

**Request Body**
```json
{
  "username": "testuser",
  "password": "Password1234!"
}
```

**Responses**
- 200 OK: User logged in successfully (returns a JWT token).
- 401 Unauthorized: Invalid credentials.

#### PUT /api/users/{id}
Update a user's profile.

**Authentication**
- Requires JWT authentication.

**Authorization**
- Requires user to be either the user being updated or an admin.

**Request Body**
- Similar to the registration body, but can update any field.

**Responses**
- 200 OK: User updated successfully.
- 401 Unauthorized: Not logged in.
- 403 Forbidden: Not authorized to update this user.
- 500 Internal Server Error: Server error.

#### DELETE /api/users/{id}
Delete a user by ID.

**Authentication**
- Requires JWT authentication.

**Authorization**
- Requires user to be either the user being deleted or an admin.

**Responses**
- 200 OK: User deleted successfully.
- 401 Unauthorized: Not logged in.
- 403 Forbidden: Not authorized to delete this user.
- 404 Not Found: User not found.
- 500 Internal Server Error: Server error.

#### GET /api/users
Get all users.

**Authentication**
- Requires JWT authentication.

**Authorization**
- Requires user to be an admin.

**Responses**
- 200 OK: Returns an array of all users.
- 401 Unauthorized: Not logged in.
- 500 Internal Server Error: Server error.

#### GET /api/users/{id}
Get a user by ID.

**Authentication**
- Requires JWT authentication.

**Authorization**
- Requires user to be either the user being retrieved or an admin.

**Responses**
- 200 OK: Returns the user data.
- 401 Unauthorized: Not logged in.
- 403 Forbidden: Not authorized to view this user.
- 404 Not Found: User not found.
- 500 Internal Server Error: Server error.

### Task Endpoints

#### POST /api/users/{user_id}/tasks
Create a new task for a user.

**Authentication**
- Requires JWT authentication.

**Authorization**
- Requires the user to be either the owner of the task or an admin.

**Request Body**
```json
{
  "name": "Test Task",
  "description": "A test task description",
  "date_time": "2024-03-15", // YYYY-MM-DD
  "status": "Pending", // "In Progress", "Completed", "Cancelled" 
  "location": "Home",
  "recurrence": "weekly", // "daily", "monthly"
  "priority": "High" // "Low", "Medium"
}
```

**Responses**
- 201 Created: Task created successfully (returns the created task data).
- 400 Bad Request: Invalid input.
- 401 Unauthorized: Not logged in.
- 403 Forbidden: Not authorized to create a task for this user.
- 500 Internal Server Error: Server error.

#### PUT /api/users/{user_id}/tasks/{task_id}
Update a task by ID.

**Authentication**
- Requires JWT authentication.

**Authorization**
- Requires the user to be either the owner of the task or an admin.

**Request Body**
- Similar to the POST /tasks body, allowing modification of fields.

**Responses**
- 200 OK: Task updated successfully (returns the updated task).
- 400 Bad Request: Invalid input.
- 401 Unauthorized: Not logged in.
- 403 Forbidden: Not authorized to update this task.
- 404 Not Found: Task not found.
- 500 Internal Server Error: Server error.

#### DELETE /api/users/{user_id}/tasks/{task_id}
Delete a task by ID.

**Authentication**
- Requires JWT authentication.

**Authorization**
- Requires the user to be either the owner of the task or an admin.

**Responses**
- 200 OK: Task deleted successfully.
- 401 Unauthorized: Not logged in.
- 403 Forbidden: Not authorized to delete this task.
- 404 Not Found: Task not found.
- 500 Internal Server Error: Server error.

#### GET /api/users/{user_id}/tasks/{task_id}
Get a task by ID.

**Authentication**
- Requires JWT authentication.

**Authorization**
- Requires the user to be either the owner of the task or an admin.

**Responses**
- 200 OK: Returns the task details.
- 401 Unauthorized: Not logged in.
- 403 Forbidden: Not authorized to view this task.
- 404 Not Found: Task not found.
- 500 Internal Server Error: Server error.

#### GET /api/users/{user_id}/tasks
Get all tasks for a user.

**Authentication**
- Requires JWT authentication.

**Authorization**
- Requires the user to be either the owner of the tasks or an admin.

**Responses**
- 200 OK: Returns an array of tasks for the user.
- 401 Unauthorized: Not logged in.
- 403 Forbidden: Not authorized to view these tasks.
- 500 Internal Server Error: Server error.

---
