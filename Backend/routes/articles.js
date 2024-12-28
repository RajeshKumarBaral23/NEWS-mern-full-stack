const express = require('express');
const Article = require('../models/article');  // Correct path to Article model
const router = express.Router();

// POST route for creating a new article
router.post('/', async (req, res) => {
  try {
    const { title, content, author } = req.body;

    // Create a new article
    const newArticle = new Article({ title, content, author });
    await newArticle.save();

    res.status(201).json({ message: 'Article created successfully', article: newArticle });
  } catch (error) {
    res.status(500).json({ message: 'Error creating article', error: error.message });
  }
});

// GET route to fetch all articles
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find();  // Find all articles
    res.status(200).json(articles);  // Send articles in response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching articles', error: error.message });
  }
});

module.exports = router;

