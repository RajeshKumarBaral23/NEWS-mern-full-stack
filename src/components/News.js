import React, { useEffect, useState } from 'react';

const News = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Fetch news from the backend
    fetch('http://localhost:3000/api/news')
      .then((response) => response.json())
      .then((data) => setNews(data))
      .catch((error) => console.error('Error fetching news:', error));
  }, []);

  return (
    <div>
      <h1>News</h1>
      <div className="news-list">
        {news.length > 0 ? (
          news.map((item) => (
            <div key={item.id} className="news-item">
              <h2>{item.title}</h2>
              <p>{item.content}</p>
              <small>
                By {item.author} on {item.date}
              </small>
            </div>
          ))
        ) : (
          <p>Loading news...</p>
        )}
      </div>
    </div>
  );
};

export default News;
