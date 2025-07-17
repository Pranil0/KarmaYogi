const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const sendOTPEmail = require('../utils/sendOTPEmail');

// Helper to generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Register User with OTP
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, location, latitude, longitude } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      location,
      geoLocation: {
        type: 'Point',
        coordinates: [
          parseFloat(longitude) || 0,
          parseFloat(latitude) || 0
        ]
      },
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
    await sendOTPEmail(email, otpCode);

    res.status(201).json({ message: 'User registered. OTP sent to email.' });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    if (!user.isVerified)
      return res.status(403).json({ message: 'Please verify your email first' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid email or password' });

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

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, location, latitude, longitude } = req.body;
    const avatar = req.file?.path;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (location) user.location = location;
    if (latitude && longitude) {
      user.geoLocation = {
        type: 'Point',
        coordinates: [
          parseFloat(longitude),
          parseFloat(latitude)
        ]
      };
    }
    if (avatar) user.profile.avatar = avatar;

    await user.save();

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
};

// Request Email Change
exports.requestEmailChange = async (req, res) => {
  try {
    const { newEmail } = req.body;

    if (!newEmail || !/^\S+@\S+\.\S+$/.test(newEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email' });
    }

    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.otp = { code: otpCode, expiresAt: otpExpiry };
    user.pendingEmail = newEmail;

    await user.save();
    await sendOTPEmail(newEmail, otpCode);

    res.json({ message: 'OTP sent to new email. Please verify to confirm email change.' });
  } catch (err) {
    res.status(500).json({ message: 'Error requesting email change', error: err.message });
  }
};

// Confirm Email Change
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
exports.getPublicProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("name profile.avatar location bio");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      avatar: user.profile.avatar,
      location: user.location,
      bio: user.profile.bio || "",
    });
  } catch (err) {
    console.error("Error fetching public profile:", err);
    res.status(500).json({ message: "Error fetching public profile" });
  }
};
