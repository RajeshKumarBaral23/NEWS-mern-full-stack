const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');  // Import CORS
const NewsAPI = require('newsapi');
const routes = require('./routes/index.js');  // Correct path

const { requestLogger, errorLogger } = require('./middleware/logger');
const { limiter } = require('./utils/constants');
const { errorsHandling } = require('./middleware/errors.js');
const {
  ERROR_MESSAGES,
  STATUS_CODES,
} = require('./utils/constants');

// Load environment variables
require('dotenv').config();

// Get the server port from the environment (default to 3000)
const { PORT = 3000 } = process.env;

const app = express();

// CORS setup - Allow requests only from your frontend
app.use(cors({
  origin: 'http://localhost:3001',  // Update with the URL of your React app
  credentials: true,  // Allow cookies, authentication headers with CORS requests
}));

// Route for the root path
app.get('/', (req, res) => {
  res.send('Welcome to the News Explorer API');
});

// Initialize NewsAPI with the key from environment variable
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

// MongoDB connection
mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.SERVER_DB_ADDRESS, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(requestLogger);
app.use(limiter);
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.use('/', routes);

// Error handling for undefined routes
app.use((req, res) => {
  res.status(STATUS_CODES.notFound).send({ message: ERROR_MESSAGES.notFound });
});

// Error handling middleware
app.use(errorLogger);
app.use(errors());
app.use(errorsHandling);

// Start the server
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
