const express = require('express');
const Article = require('../models/article'); // Correct path to Article model
const router = express.Router();

// POST route for creating a new article
router.post('/', async (req, res) => {
  try {
    // Destructure the required fields from the request body
    const { title, content, author, image } = req.body;

    // Create a new article with the fields received from the request
    const newArticle = new Article({ title, content, author, image });

    // Save the new article to the database
    await newArticle.save();

    // Send success response
    res.status(201).json({
      message: 'Article created successfully',
      article: newArticle,
    });
  } catch (error) {
    // Catching any errors and returning a 500 error with the error message
    res.status(500).json({
      message: 'Error creating article',
      error: error.message,
    });
  }
});

// GET route to fetch all articles
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find(); // Find all articles
    res.status(200).json(articles); // Send articles in response
  } catch (error) {
    // Error handling for fetching articles
    res.status(500).json({
      message: 'Error fetching articles',
      error: error.message,
    });
  }
});

// GET route to fetch a single article by its ID
router.get('/:id', async (req, res) => {
  try {
    // Find article by ID
    const article = await Article.findById(req.params.id);

    // If article is not found, return a 404 error with a message
    if (!article) {
      return res.status(404).json({
        message: 'Article not found',
      });
    }

    // Send the article data in response
    res.status(200).json(article);
  } catch (error) {
    // Error handling for fetching a specific article
    res.status(500).json({
      message: 'Error fetching article',
      error: error.message,
    });
  }
});

module.exports = router;
