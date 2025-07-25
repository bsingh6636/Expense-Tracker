const express = require('express');
const cors = require('cors');
require('dotenv').config();

const expenseRoutes = require('./routes/expenses');
const friendRoutes = require('./routes/friends');
const db = require('./models');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin : 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/friends', friendRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Expense Tracker API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});



// Database connection and server start
db.sequelize.authenticate().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  logger.error('Unable to connect to database:', err);
});