import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Corrected import
import './App.css';
import Login from './Login';
import Register from './Register';
import FullArticle from './components/FullArticle'; // Correct path to FullArticle component

function App() {
  const [articles, setArticles] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [error, setError] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (token) {
      fetch('http://localhost:3000/articles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setArticles(data);
          setError(null);
        })
        .catch((error) => {
          console.error('Error fetching articles:', error);
          setError('Failed to load articles. Please try again later.');
        });
    }
  }, [token]);

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  const toggleRegister = () => setShowRegister((prev) => !prev);

  return (
    <Router> {/* Wrap your app in the Router */}
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
          {!token ? (
            <>
              <Login
                setToken={(token) => {
                  setToken(token);
                  localStorage.setItem('token', token);
                }}
              />
              <button onClick={toggleRegister}>Register</button>
              {showRegister && <Register />}
            </>
          ) : (
            <>
              <button onClick={handleLogout}>Logout</button>
              <section className="news-section">
                <h2>Latest Articles</h2>
                {error && <p className="error-message">{error}</p>}
                {articles.length > 0 ? (
                  articles.map((article) => (
                    <div key={article._id} className="news-article">
                      <h3>{article.title}</h3>
                      <p className="news-summary">{article.content.slice(0, 150)}...</p>
                      <p className="news-author"><strong>Author:</strong> {article.author}</p>
                      <p className="news-date">
                        <strong>Published:</strong> {new Date(article.createdAt).toLocaleDateString()}
                      </p>
                      <Link to={`/article/${article._id}`} className="read-more">Read more</Link>
                    </div>
                  ))
                ) : (
                  <p>Loading articles...</p>
                )}
              </section>
            </>
          )}
        </main>

        <footer className="App-footer">
          <p>&copy; 2024 CBN News. All rights reserved.</p>
        </footer>
      </div>

      {/* Routes handling */}
      <Routes> {/* Use Routes instead of Switch */}
        <Route path="/article/:id" element={<FullArticle />} /> {/* Full article route */}
      </Routes>
    </Router>
  );
}

export default App;
