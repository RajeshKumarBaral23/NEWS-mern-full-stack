import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to get the article id

function FullArticle() {
  const { id } = useParams(); // Get the article id from the URL
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the full article using the id
    fetch(`http://localhost:3000/articles/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setArticle(data); // Set the article data
        setError(null); // Clear any previous errors
      })
      .catch((error) => {
        console.error('Error fetching the article:', error);
        setError('Failed to load the article. Please try again later.');
      });
  }, [id]); // Only run when the id changes

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!article) {
    return <p>Loading article...</p>;
  }

  return (
    <div className="full-article">
      <h2>{article.title}</h2>
      <img src={article.image} alt={article.title} className="article-image" />
      <p>{article.content}</p>
      <p><strong>Author:</strong> {article.author}</p>
      <p><strong>Published:</strong> {new Date(article.createdAt).toLocaleDateString()}</p>
    </div>
  );
}

export default FullArticle;
