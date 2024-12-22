const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Constants and DB connection
const { ERROR_MESSAGES, STATUS_CODES, DB_ADDRESS } = require('./utils/constants'); // Make sure to define these in a constants file
const { PORT = 3001 } = process.env;

// Sample news data for the API
const sampleNews = [
  { title: 'Breaking News 1', description: 'Details about breaking news 1.' },
  { title: 'Breaking News 2', description: 'Details about breaking news 2.' },
];

// Create the Express app
const app = express();

// Middleware setup
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Mongoose DB connection
mongoose.set('strictQuery', false);
mongoose.connect(DB_ADDRESS, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic routes
app.get('/', (req, res) => {
  res.status(STATUS_CODES.ok).json({ message: 'Welcome to the News API!' });
});

app.get('/api/news', (req, res) => {
  res.json(sampleNews);
});

// Static file serving (if needed)
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route for undefined routes (404)
app.use((req, res) => {
  res.status(STATUS_CODES.notFound).send({ message: ERROR_MESSAGES.notFound });
});

// Start the server
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
