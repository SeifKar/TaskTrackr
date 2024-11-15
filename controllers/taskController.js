const Task = require('../models/Task');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
    try {
        const { title, description, deadline, priority } = req.body;

        const task = await Task.create({
            title,
            description,
            deadline,
            priority,
            user: req.user._id
        });

        res.status(201).json({
            status: 'success',
            data: task
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
    try {
        const { status, priority, search, sortBy } = req.query;
        
        // Build query
        const query = { user: req.user._id };
        
        // Filter by status
        if (status) {
            query.status = status;
        }
        
        // Filter by priority
        if (priority) {
            query.priority = priority;
        }
        
        // Search in title or description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort object
        let sort = {};
        if (sortBy) {
            const [field, order] = sortBy.split(':');
            sort[field] = order === 'desc' ? -1 : 1;
        } else {
            sort = { createdAt: -1 }; // Default sort by creation date
        }

        const tasks = await Task.find(query).sort(sort);

        res.json({
            status: 'success',
            results: tasks.length,
            data: tasks
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!task) {
            return res.status(404).json({
                status: 'fail',
                message: 'Task not found'
            });
        }

        res.json({
            status: 'success',
            data: task
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id
            },
            req.body,
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({
                status: 'fail',
                message: 'Task not found'
            });
        }

        res.json({
            status: 'success',
            data: task
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!task) {
            return res.status(404).json({
                status: 'fail',
                message: 'Task not found'
            });
        }

        res.json({
            status: 'success',
            message: 'Task deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
exports.updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id
            },
            { status },
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({
                status: 'fail',
                message: 'Task not found'
            });
        }

        res.json({
            status: 'success',
            data: task
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};
