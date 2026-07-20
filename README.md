# TaskPilot Backend

A RESTful backend for **TaskPilot**, a task management application that enables secure authentication, task management, project and team organization, advanced filtering, and productivity reporting. Built with Node.js, Express.js, and MongoDB.

---

## Quick Start

```bash
git clone https://github.com/sourjyendu-barik/Task_pilot.git
cd Task_pilot
npm install
npm run dev
```

Create a `.env` file.

```env
MONGODB="your uro"
PORT="your port
SECRETKEY="your key"
```

---

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

---

## Features

### Authentication

- User registration with encrypted passwords
- Secure login using JWT authentication
- Protected API routes
- Get authenticated user details

### Task Management

- Create, update, and delete tasks
- Assign multiple owners to tasks
- Manage task status
- Add multiple tags
- Set estimated completion time
- Filter tasks using query parameters

### Project Management

- Create projects
- Retrieve all projects
- Group tasks by project

### Team Management

- Create teams
- Retrieve all teams
- Organize tasks by team

### Tags

- Create custom tags
- Retrieve all tags
- Assign multiple tags to tasks

### Reports

- Tasks completed in the last week
- Total pending work
- Tasks closed by team
- Tasks closed by owner
- Tasks closed by project

---

## API Reference

### POST `/auth/signup`

Register a new user.

**Sample Request**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

---

### POST `/auth/login`

Authenticate a user.

**Sample Request**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Sample Response**

```json
{
  "token": "<jwt_token>"
}
```

---

### GET `/auth/me`

Get the authenticated user's details.

**Sample Response**

```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

### POST `/tasks`

Create a new task.

**Sample Request**

```json
{
  "name": "Design Landing Page",
  "project": "Website Redesign",
  "team": "teamId",
  "owners": ["userId1", "userId2"],
  "tags": ["UI", "Urgent"],
  "timeToComplete": 5,
  "status": "To Do"
}
```

---

### GET `/tasks`

List all tasks.

Supports filtering using:

- team
- owner
- project
- status
- tags

Example:

```http
GET /tasks?team=Development&status=In%20Progress
```

**Sample Response**

```json
[
  {
    "_id": "...",
    "name": "Design Landing Page",
    "project": "Website Redesign",
    "team": "Development",
    "owners": ["John Doe"],
    "tags": ["UI", "Urgent"],
    "timeToComplete": 5,
    "status": "In Progress"
  }
]
```

---

### POST `/tasks/:id`

Update a task.

**Sample Response**

```json
{
  "message": "Task updated successfully"
}
```

---

### DELETE `/tasks/:id`

Delete a task.

**Sample Response**

```json
{
  "message": "Task deleted successfully"
}
```

---

### POST `/projects`

Create a new project.

**Sample Request**

```json
{
  "name": "Website Redesign",
  "description": "Redesign company website"
}
```

---

### GET `/projects`

List all projects.

**Sample Response**

```json
[
  {
    "_id": "...",
    "name": "Website Redesign",
    "description": "Redesign company website"
  }
]
```

---

### POST `/teams`

Create a new team.

**Sample Request**

```json
{
  "name": "Development",
  "description": "Handles software development"
}
```

---

### GET `/teams`

List all teams.

**Sample Response**

```json
[
  {
    "_id": "...",
    "name": "Development",
    "description": "Handles software development"
  }
]
```

---

### POST `/tags`

Create a new tag.

**Sample Request**

```json
{
  "name": "Urgent"
}
```

---

### GET `/tags`

List all tags.

**Sample Response**

```json
[
  {
    "_id": "...",
    "name": "Urgent"
  }
]
```

---

### GET `/report/last-week`

Get tasks completed during the last week.

**Sample Response**

```json
{
  "completedTasks": 24
}
```

---

### GET `/report/pending`

Get total pending work.

**Sample Response**

```json
{
  "pendingDays": 38
}
```

---

### GET `/report/closed-tasks`

Get task completion statistics grouped by team, owner, or project.

**Sample Response**

```json
[
  {
    "team": "Development",
    "completedTasks": 15
  },
  {
    "team": "Marketing",
    "completedTasks": 9
  },
  {
    "team": "Sales",
    "completedTasks": 11
  }
]
```

---

## Contact

For bugs or feature requests, please reach out to **sourjyendubarik7798@gmail.com**

```

```
