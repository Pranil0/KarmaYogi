const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/admin');
const { getAllUsers, getAllTasks, getAllOffers, getAllReviews } = require('../controllers/AdminController');

router.use(auth, isAdmin);
router.get('/users', getAllUsers);
router.get('/tasks', getAllTasks);
router.get('/offers', getAllOffers);
router.get('/reviews', getAllReviews);

module.exports = router;
