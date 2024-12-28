const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
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
require('dotenv').config(); // Ensure dotenv is loaded

// Get the server port from the environment (default to 3000)
const { PORT = 3000 } = process.env; // Now using PORT=3000 as default

const app = express();

// Route for the root path - added this
app.get('/', (req, res) => {
  res.send('Welcome to the News Explorer API');
});

// Initialize NewsAPI with the key from environment variable
const newsapi = new NewsAPI(process.env.NEWS_API_KEY); // This should work now

// MongoDB connection using the updated SERVER_DB_ADDRESS from .env
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
app.use(cors());
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

// Start the server and listen on the correct port
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
