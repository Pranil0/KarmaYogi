const Task = require('../models/TaskModel');
const Offer = require('../models/OfferModel');
const { notifyTaskEdited, notifyTaskCanceled } = require('./NotificationController');

// ✅ Create Task (Authenticated)
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      latitude,
      longitude,
      budget,
      dueDate
    } = req.body;

    const task = new Task({
      title,
      description,
      category,
      location,
      latitude,
      longitude,
      budget,
      dueDate: dueDate ? new Date(dueDate) : null,
      createdBy: req.user.id
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task', error: err.message });
  }
};

// ✅ Get All Tasks (Public, excludes cancelled)
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ isCancelled: { $ne: true } })
    
      .populate('createdBy', 'name profile.avatar')
      .populate('assignedTo', 'name');
      
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// ✅ Get Featured Gigs (Public, top 8, excludes cancelled)
exports.getFeaturedTasks = async (req, res) => {
  try {
    const gigs = await Task.find({ isCancelled: { $ne: true } })
      .sort({ createdAt: -1 })
      .limit(8)
      .select('title location dueDate budget description category');
    res.json(gigs);
  } catch (error) {
    console.error('Error fetching featured gigs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get My Tasks (Authenticated)
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      createdBy: req.user.id,
      isCancelled: { $ne: true }
    }).populate('assignedTo', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching my tasks' });
  }
};

// ✅ Get Task By ID (Authenticated - poster or offerer can see cancelled)
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'name profile.avatar')
      .populate('assignedTo', 'name');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const createdById = (task.createdBy?._id || task.createdBy).toString();
    const userId = req.user.id.toString();

    if (task.isCancelled) {
      const isPoster = createdById === userId;

      const isOfferer = await Offer.exists({
        task: task._id,
        user: userId,
      });

      if (!isPoster && !isOfferer) {
        return res.status(410).json({ message: 'This task has been cancelled and is no longer available.' });
      }
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching task by ID' });
  }
};

// ✅ Assign Task to User (Authenticated)
exports.assignTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    task.assignedTo = req.body.assignedTo;
    task.status = 'assigned';
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error assigning task' });
  }
};

// ✅ Cancel Task (Authenticated)
exports.cancelTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to cancel this task' });
    }

    task.status = 'cancelled';
    task.isCancelled = true;
    await task.save();

    await notifyTaskCanceled(task._id); // 🔔 Notify offerers

    res.status(200).json({ message: 'Task cancelled successfully', task });
  } catch (err) {
    res.status(500).json({ message: 'Server error while cancelling task' });
  }
};

// ✅ Update Task (Authenticated)
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const {
      title,
      description,
      category,
      location,
      latitude,
      longitude,
      budget,
      dueDate
    } = req.body;

    task.title = title || task.title;
    task.description = description || task.description;
    task.category = category || task.category;
    task.location = location || task.location;
    task.latitude = latitude || task.latitude;
    task.longitude = longitude || task.longitude;
    task.budget = budget || task.budget;
    task.dueDate = dueDate ? new Date(dueDate) : null;

    await task.save();

    await notifyTaskEdited(task._id); // 🔔 Notify offerers

    res.json({ message: 'Task updated successfully', task });
  } catch (err) {
    res.status(500).json({ message: 'Error updating task' });
  }
};
