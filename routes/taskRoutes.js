const express = require('express');
const router = express.Router();
const {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
    updateTaskStatus
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// Task routes
router.route('/')
    .post(createTask)
    .get(getTasks);

router.route('/:id')
    .get(getTask)
    .put(updateTask)
    .delete(deleteTask);

router.patch('/:id/status', updateTaskStatus);

module.exports = router;
