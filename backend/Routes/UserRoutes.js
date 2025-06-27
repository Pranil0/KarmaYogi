const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getProfile } = require('../controllers/UserController');
const auth = require('../middleware/auth');
const upload = require('../middleware/uploads'); // updated multer middleware

// Register user with avatar upload
router.post('/register', upload.single('avatar'), registerUser);

// Login
router.post('/login', loginUser);

// Protected route to get user profile
router.get('/profile', auth, getProfile);

module.exports = router;
