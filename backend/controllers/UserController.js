const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const sendOTPEmail = require('../utils/sendOTPEmail');

// Helper to generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Register User with OTP flow
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, location } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already in use' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      location,
      profile: {
        avatar: req.file?.path || ""
      },
      otp: {
        code: otpCode,
        expiresAt: otpExpiry
      },
      isVerified: false
    });

    await newUser.save();

    // Send OTP Email
    await sendOTPEmail(email, otpCode);

    res.status(201).json({ message: 'User registered. OTP sent to email.' });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

// Login User (only if verified)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    if (!user.isVerified)
      return res.status(403).json({ message: 'Please verify your email first' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid email or password' });

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        avatar: user.profile.avatar
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

// Get Logged-in User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp');
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};

// Update User Profile (name, location, avatar)
exports.updateProfile = async (req, res) => {
  try {
    const { name, location } = req.body;
    const avatar = req.file?.path;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (location) user.location = location;
    if (avatar) user.profile.avatar = avatar;

    await user.save();

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
};

// Change Email - send OTP to new email and set pending email
exports.requestEmailChange = async (req, res) => {
  try {
    const { newEmail } = req.body;

    if (!newEmail || !/^\S+@\S+\.\S+$/.test(newEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email' });
    }

    // Check if newEmail is already in use
    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Generate OTP for email verification
    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Store newEmail and OTP in user doc temporarily
    user.otp = { code: otpCode, expiresAt: otpExpiry };
    user.pendingEmail = newEmail;

    await user.save();

    // Send OTP to newEmail
    await sendOTPEmail(newEmail, otpCode);

    res.json({ message: 'OTP sent to new email. Please verify to confirm email change.' });
  } catch (err) {
    res.status(500).json({ message: 'Error requesting email change', error: err.message });
  }
};

// Confirm Email Change with OTP
exports.confirmEmailChange = async (req, res) => {
  try {
    const { otp } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.otp || !user.otp.code || !user.otp.expiresAt) {
      return res.status(400).json({ message: 'No OTP found. Request email change first.' });
    }

    if (user.otp.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (!user.pendingEmail) {
      return res.status(400).json({ message: 'No pending email change found' });
    }

    // Update email, clear OTP and pendingEmail
    user.email = user.pendingEmail;
    user.pendingEmail = undefined;
    user.otp = undefined;

    await user.save();

    res.json({ message: 'Email updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error confirming email change', error: err.message });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error changing password', error: err.message });
  }
};
