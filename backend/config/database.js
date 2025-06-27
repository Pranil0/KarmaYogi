const mongoose = require('mongoose');

const databaseConnection = () => {
  mongoose.connect(process.env.MONGO_URI)
    .then(data => {
      console.log(`Database connected successfully at server ${data.connection.host}`);
    })
    .catch(err => {
      console.error('Database connection error:', err);
    });
};

module.exports = databaseConnection;
