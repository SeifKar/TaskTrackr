# TaskTrackr

A full-stack MERN (MongoDB, Express.js, React, Node.js) task management application with user authentication.

## Features

- User Authentication (Register/Login)
- Task Management (Create, Read, Update, Delete)
- Task Filtering and Sorting
- Task Status Updates
- Responsive Material-UI Design

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React
- Material-UI
- React Router
- Formik & Yup
- Axios

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/SeifKar/TaskTrackr.git
cd TaskTrackr
```

2. Install dependencies:
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
```

3. Create a .env file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tasktrackr
JWT_SECRET=your_jwt_secret_key_here
```

4. Start the development servers:
```bash
# Start backend server (from root directory)
npm start

# Start frontend server (from client directory)
cd client
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## API Endpoints

### Authentication
- POST /api/users/register - Register a new user
- POST /api/users/login - Login user
- GET /api/users/profile - Get user profile

### Tasks
- GET /api/tasks - Get all tasks (with filters)
- POST /api/tasks - Create new task
- GET /api/tasks/:id - Get task by ID
- PUT /api/tasks/:id - Update task
- DELETE /api/tasks/:id - Delete task
- PATCH /api/tasks/:id/status - Update task status

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
