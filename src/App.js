import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Fetch articles from backend
    fetch('http://localhost:3000/articles')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched Articles:', data); // Debugging log
        setArticles(data); // Store all articles in the state
      })
      .catch((error) => console.error('Error fetching articles:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="news-site-title">CBN News</h1>
        <nav className="navbar">
          <a href="/" className="nav-link">Home</a>
          <a href="/world" className="nav-link">World</a>
          <a href="/politics" className="nav-link">Politics</a>
          <a href="/business" className="nav-link">Business</a>
          <a href="/technology" className="nav-link">Technology</a>
        </nav>
      </header>

      <main className="main-content">
        <section className="news-section">
          <h2>Latest Articles</h2>
          {articles.length > 0 ? (
            articles.map((article) => (
              <div key={article._id} className="news-article">
                <h3>{article.title}</h3>
                <p className="news-summary">{article.content.slice(0, 150)}...</p>
                <p className="news-author"><strong>Author:</strong> {article.author}</p>
                <p className="news-date">
                  <strong>Published:</strong> {new Date(article.createdAt).toLocaleDateString()}
                </p>
                <a href={`/article/${article._id}`} className="read-more">Read more</a>
              </div>
            ))
          ) : (
            <p>Loading articles...</p>
          )}
        </section>
      </main>

      <footer className="App-footer">
        <p>&copy; 2024 CBN News. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
