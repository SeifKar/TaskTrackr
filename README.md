# TaskTrackr

A full-stack MERN (MongoDB, Express.js, React, Node.js) task management application with user authentication and real-time notifications.

## Features

- User Authentication (Register/Login)
- Task Management (Create, Read, Update, Delete)
- Task Filtering and Sorting
- Task Status Updates
- Real-time Notifications
- Email Notifications
- Responsive Material-UI Design

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Nodemailer for email notifications

### Frontend
- React
- Material-UI
- React Router
- React-Toastify
- Formik & Yup
- Axios

## Getting Started

### Local Development

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

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the variables in `.env` with your values:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tasktrackr
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=TaskTrackr <notifications@tasktrackr.com>
```

4. Start the development servers:
```bash
# Start backend and frontend concurrently
npm run dev

# Or start them separately:
# Backend only
npm run server

# Frontend only
npm run client
```

## Deployment

### Prerequisites
- Node.js 14+ installed on the server
- MongoDB database (local or cloud service like MongoDB Atlas)
- SMTP email service credentials
- Domain name (optional)

### Deployment Steps

1. Set up MongoDB:
   - Create a MongoDB Atlas cluster (recommended for production)
   - Get your MongoDB connection URI
   - Update `MONGODB_URI` in your production environment

2. Configure Environment Variables:
   - Set up all required environment variables on your hosting platform
   - Make sure to use strong, unique values for production
   - Never commit sensitive credentials to version control

3. Build the Frontend:
```bash
cd client
npm run build
```

4. Deploy to Hosting Platform (e.g., Heroku):
```bash
# Login to Heroku
heroku login

# Create a new Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set EMAIL_USER=your_email
heroku config:set EMAIL_PASSWORD=your_app_password

# Push to Heroku
git push heroku main
```

5. For other platforms (e.g., DigitalOcean, AWS):
   - Set up a Node.js environment
   - Configure environment variables
   - Set up a process manager (e.g., PM2)
   - Configure reverse proxy (e.g., Nginx)
   - Set up SSL certificate

### Production Considerations

1. Security:
   - Use strong JWT secrets
   - Enable CORS with specific origins
   - Set up rate limiting
   - Use helmet for security headers
   - Enable HTTPS only

2. Performance:
   - Enable gzip compression
   - Use caching strategies
   - Optimize database queries
   - Implement proper error handling

3. Monitoring:
   - Set up application monitoring
   - Configure error tracking
   - Set up performance monitoring
   - Enable logging

4. Maintenance:
   - Regular backups
   - Security updates
   - Dependency updates
   - Performance optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
