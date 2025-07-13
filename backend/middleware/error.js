// middleware/error.js

// Express error-handling middleware must have 4 parameters: err, req, res, next
module.exports = (err, req, res, next) => {
  console.error(err.stack); // Logs error stack on server console (optional)

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
};
