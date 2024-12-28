const express = require('express');
const router = express.Router();

// Import route handlers
const authRouter = require('./auth');
const usersRouter = require('./users');
const articlesRouter = require('./articles');  // Import articles route

// Routes
router.use('/auth', authRouter);  // Authentication routes
router.use('/users', usersRouter);  // User-related routes
router.use('/articles', articlesRouter);  // Article-related routes

// Catch-all for undefined routes
router.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = router;
