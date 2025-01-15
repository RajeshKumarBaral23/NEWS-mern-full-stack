// filepath: /C:/Users/lemrk/Music/NEWS-mern-full-stack/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Register from './Register';
import FullArticle from './components/FullArticle';
import HomePage from './components/HomePage'; // Ensure correct import

const Navbar = ({ token, handleLogout, toggleRegister, toggleLogin }) => (
  <header className="App-header">
    <h1 className="news-site-title">CBN News</h1>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Home</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!token ? (
              <>
                <li className="nav-item">
                  <button className="btn btn-primary nav-link" onClick={toggleLogin}>Sign In</button>
                </li>
                <li className="nav-item">
                  <button className="btn btn-secondary nav-link" onClick={toggleRegister}>Register</button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-danger nav-link" onClick={handleLogout}>Logout</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  </header>
);

const ArticleCard = ({ article }) => (
  <div className="news-article card mb-3">
    <div className="row g-0">
      {article.imageUrl && (
        <div className="col-md-4">
          <img src={article.imageUrl} alt={article.title} className="img-fluid rounded-start" />
        </div>
      )}
      <div className={`col-md-${article.imageUrl ? 8 : 12}`}>
        <div className="card-body">
          <h3 className="card-title">{article.title}</h3>
          <p className="card-text">{article.content.slice(0, 150)}...</p>
          <p className="card-text"><strong>Author:</strong> {article.author}</p>
          <p className="card-text">
            <strong>Published:</strong> {new Date(article.createdAt).toLocaleDateString()}
          </p>
          <Link to={`/article/${article._id}`} className="btn btn-primary">Read more</Link>
        </div>
      </div>
    </div>
  </div>
);

const MainContent = ({ token, articles, error, handleLogout, showRegister, toggleRegister, registerError, handleRegisterSuccess, setRegisterError, showLogin, toggleLogin }) => (
  <main className="main-content container mt-4">
    {!token ? (
      <>
        {showLogin && (
          <Login
            setToken={(token) => {
              localStorage.setItem('token', token);
              window.location.reload();
            }}
          />
        )}
        <button className="btn btn-primary mt-3" onClick={toggleRegister}>Register</button>
        {showRegister && (
          <Register onSuccess={handleRegisterSuccess} setRegisterError={setRegisterError} />
        )}
        {registerError && <p className="text-danger mt-3">{registerError}</p>}
      </>
    ) : (
      <>
        <button className="btn btn-danger mt-3" onClick={handleLogout}>Logout</button>
        <section className="news-section mt-4">
          <h2>Latest Articles</h2>
          {error && <p className="text-danger">{error}</p>}
          {articles.length > 0 ? (
            articles.map((article) => <ArticleCard key={article._id} article={article} />)
          ) : (
            <p>Loading articles...</p>
          )}
        </section>
      </>
    )}
  </main>
);

function App() {
  const [articles, setArticles] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [error, setError] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (token) {
      fetch('http://localhost:3000/articles', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          setArticles(data);
          setError(null);
        })
        .catch((err) => {
          console.error('Error fetching articles:', err);
          setError('Failed to load articles. Please try again later.');
        });
    }
  }, [token]);

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    window.location.reload();
  };

  const toggleRegister = () => setShowRegister((prev) => !prev);
  const toggleLogin = () => setShowLogin((prev) => !prev);

  const handleRegisterSuccess = () => {
    setShowRegister(false);
    setRegisterError(null);
    alert('Registration successful! You can now log in.');
  };

  return (
    <Router>
      <div className="App">
        <Navbar token={token} handleLogout={handleLogout} toggleRegister={toggleRegister} toggleLogin={toggleLogin} />
        <Routes>
          <Route path="/" element={<MainContent
            token={token}
            articles={articles}
            error={error}
            handleLogout={handleLogout}
            showRegister={showRegister}
            toggleRegister={toggleRegister}
            registerError={registerError}
            handleRegisterSuccess={handleRegisterSuccess}
            setRegisterError={setRegisterError}
            showLogin={showLogin}
            toggleLogin={toggleLogin}
          />} />
          <Route path="/article/:id" element={<FullArticle />} />
        </Routes>
        <footer className="App-footer bg-dark text-white mt-4 p-3 text-center">
          <p>&copy; 2025 CBN News. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
