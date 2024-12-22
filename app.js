const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes/index.js');

const { requestLogger, errorLogger } = require('./middleware/logger');
const { limiter } = require('./utils/constants');
const { errorsHandling } = require('./middleware/errors.js');
const {
  ERROR_MESSAGES,
  STATUS_CODES,
  DB_ADDRESS,
} = require('./utils/constants');

// Set the server port
const { PORT = 3001 } = process.env;

const app = express();

// Define allowed CORS origins
const allowedCors = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://newsapi.org/v2',
  'https://nomoreparties.co/news/v2',
  'https://lkovacs-news.students.nomoreparties.site',
];

// Mongoose configuration
mongoose.set('strictQuery', false);
mongoose
  .connect(DB_ADDRESS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Set up CORS
app.use((req, res, next) => {
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  next();
});

app.use(cors());
app.options('*', cors());

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(requestLogger);
app.use(limiter);

// Static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Define a default welcome route
app.get('/', (req, res) => {
  res.status(STATUS_CODES.ok).json({ message: 'Welcome to the News API!' });
});

// News API route for sample news
app.get('/api/news', (req, res) => {
  const sampleNews = [
    { title: 'Breaking News 1', description: 'Details about breaking news 1.' },
    { title: 'Breaking News 2', description: 'Details about breaking news 2.' },
  ];
  res.json(sampleNews);
});

// Use routes from the routes folder
app.use('/', routes);

// Handle 404 errors for undefined routes
app.use((req, res) => {
  res.status(STATUS_CODES.notFound).send({ message: ERROR_MESSAGES.notFound });
});

// Error logging and handling
app.use(errorLogger);
app.use(errors()); // Celebrate error handling middleware
app.use(errorsHandling); // Custom error handling middleware

// Start the server
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
