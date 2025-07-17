const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  requestEmailChange,
  confirmEmailChange,
  changePassword,
  getPublicProfile
} = require('../controllers/UserController');

const {
  verifyOTP,
  resendOTP
} = require('../controllers/EmailVerificationController');

const auth = require('../middleware/auth');
const upload = require('../middleware/uploads'); // multer for avatar upload

// Register user with avatar upload
router.post('/register', upload.single('avatar'), registerUser);

// Login user
router.post('/login', loginUser);

// Verify email OTP
router.post('/verify-otp', verifyOTP);

// Resend OTP email
router.post('/resend-otp', resendOTP);

// Protected routes - require auth
router.get('/profile', auth, getProfile);

// Update profile (name, location, avatar)
router.put('/profile', auth, upload.single('avatar'), updateProfile);

// Request email change (send OTP to new email)
router.put('/email', auth, requestEmailChange);

// Confirm email change with OTP
router.post('/email/confirm', auth, confirmEmailChange);

// Change password
router.put('/password', auth, changePassword);
// 🔥 Public profile route
router.get('/:id/profile',  getPublicProfile);



module.exports = router;
