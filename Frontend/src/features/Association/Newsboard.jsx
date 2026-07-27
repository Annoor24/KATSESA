import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNews } from '../../api/api';

function Newsboard() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews().then(data => {
      setNews(data);
      setLoading(false);
    });
  }, []);

  const categories = ['All', 'Exams', 'Meetings', 'Deadlines', 'General'];

  const filteredNews = filter === 'All' 
    ? news 
    : news.filter(item => item.category === filter);

  return (
    <div className="newsboard-container">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate('/association')}>
          ← Back
        </button>
        <h2 className="page-title">Digital Newsboard</h2>
      </header>

      <div className="filter-bar glass-card">
        {categories.map(cat => (
          <button 
            key={cat}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="news-feed">
        {loading ? (
          <p className="loading-text">Fetching latest announcements...</p>
        ) : filteredNews.length > 0 ? (
          filteredNews.map(item => (
            <div key={item.id} className="news-card glass-card">
              <div className="news-meta-top">
                <span className={`news-cat-tag ${item.category?.toLowerCase()}`}>
                  {item.category || 'General'}
                </span>
                <span className="news-timestamp">
                  {item.fullTimestamp || item.date}
                </span>
              </div>
              <h3 className="news-card-title">{item.title}</h3>
              <p className="news-card-content">{item.content}</p>
            </div>
          ))
        ) : (
          <div className="no-news glass-card">
            <p>No announcements found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Newsboard;
