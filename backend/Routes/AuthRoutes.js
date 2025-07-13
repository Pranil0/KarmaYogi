const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser
} = require('../controllers/UserController');

const {
  verifyOTP,
  resendOTP
} = require('../controllers/EmailVerificationController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP); // optional

module.exports = router;
