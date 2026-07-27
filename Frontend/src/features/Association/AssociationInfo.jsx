import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNews } from '../../api/api';
import Footer from '../../components/Footer';

function AssociationInfo() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchNews().then(setNews);
  }, []);

  const menuItems = [
    { 
      title: 'Executives', 
      desc: 'Meet the ABU Zaria Chapter leadership team', 
      path: '/association/executives',
      icon: '👥'
    },
    { 
      title: 'Constitution', 
      desc: 'Read the KATSESA guiding documents', 
      path: '/association/constitution',
      icon: '📜'
    },
    { 
      title: 'Newsboard', 
      desc: 'All official announcements & deadlines', 
      path: '/association/news',
      icon: '📰'
    },
    { 
      title: 'Events Archive', 
      desc: 'Memories from past & upcoming events', 
      path: '/association/events',
      icon: '📸'
    }
  ];

  return (
    <div className="association-hub">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h2 className="page-title">Association Info</h2>
      </header>

      <section className="latest-news society-news glass-card">
        <h3 className="section-title">Latest Updates</h3>
        <div className="news-list">
          {news.length > 0 ? news.map(item => (
            <div key={item.id} className="news-item">
              <span className="news-date">{item.date}</span>
              <h4 className="news-title">{item.title}</h4>
              <p className="news-excerpt">{item.content}</p>
            </div>
          )) : <p>Loading latest updates...</p>}
        </div>
      </section>

      <section className="hub-grid">
        {menuItems.map((item) => (
          <button 
            key={item.title} 
            className="hub-card glass-card"
            onClick={() => navigate(item.path)}
          >
            <span className="hub-icon">{item.icon}</span>
            <div className="hub-info">
              <span className="hub-title">{item.title}</span>
              <span className="hub-desc">{item.desc}</span>
            </div>
          </button>
        ))}
      </section>
      
      <Footer />
    </div>
  );
}

export default AssociationInfo;
