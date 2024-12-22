const rateLimit = require('express-rate-limit');

// Use environment variables for sensitive data
const { NODE_ENV, SERVER_DB_ADDRESS } = process.env;

// MongoDB connection string with fallback for local development
module.exports.DB_ADDRESS = NODE_ENV === 'production'
  ? SERVER_DB_ADDRESS
  : 'mongodb+srv://rjbaral19:vSYW2JgzOCNNgYfT@cluster0.ry1g4.mongodb.net/newsdb?retryWrites=true&w=majority';

// Development secret key (use a secure key in production)
module.exports.DEV_KEY = 'dev-secret';

// Rate limiter to prevent abuse (100 requests per 15 minutes)
module.exports.limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Status codes used throughout the app
module.exports.STATUS_CODES = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  notFound: 404,
  serverError: 500,
};

// Error messages for common issues
module.exports.ERROR_MESSAGES = {
  notFound: 'Requested resource not found.',
  unauthorized: 'Authorization Required',
  serverError: 'An error has occurred on the server.',
  articlebadRequest: 'Data validation failed.',
  articleNotFound: 'Article not found.',
  deleteArticle: 'You can only delete your own articles.',
  signin: 'Incorrect email or password.',
  signup: 'Unable to create a user with the credentials provided.',
  userBadRequest: 'User not found.',
};
