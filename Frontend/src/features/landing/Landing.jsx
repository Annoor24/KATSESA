import { useState, useEffect } from 'react';
import logo from '../../assets/katsesa-logo.png';
import { useNavigate } from 'react-router-dom';
import { fetchNews } from '../../api/api';

function Landing() {
  const navigate = useNavigate();
  const [latestNews, setLatestNews] = useState('Welcome to the official KATSESA portal. All academic materials for the 2025/2026 session are now being updated.');

  useEffect(() => {
    fetchNews().then(news => {
      if (news && news.length > 0) {
        const sorted = news.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLatestNews(sorted[0].title + ": " + sorted[0].content);
      }
    });
  }, []);

  return (
    <main className="hero-section">
      {/* Cinematic Video Background */}
      <div className="video-bg-container">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="bg-video"
          poster="/assets/katsesa-logo.png"
        >
          <source src="https://assets.mixkit.co/videos/23511/23511-720.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
      </div>

      <button className="admin-trigger" onClick={() => navigate('/login')} title="Admin Access">
        <span className="admin-label">Admin Access</span>
        <span className="admin-icon">⚙️</span>
      </button>

      <header className="hero-header">
        <img src={logo} alt="KATSESA Logo" className="main-logo" />
        <p className="association-name">Katsina State Engineering Students' Association</p>
        <p className="chapter-name">ABU ZARIA CHAPTER</p>
      </header>

      <section className="portal-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Official Digital Gateway
          </h1>
          <p className="hero-subtitle">
            Empowering the next generation of engineers with instant access to academic resources and official state updates.
          </p>

          <div className="cta-group">
            <button 
              className="cta-button secondary-info"
              onClick={() => navigate('/academic-hub')}
            >
              <span className="icon">📚</span>
              <div className="btn-text">
                <span className="btn-title">Academic Hub</span>
                <span className="btn-desc">100L - 200L Materials</span>
              </div>
            </button>

            <button 
              className="cta-button secondary-info"
              onClick={() => navigate('/association')}
            >
              <span className="icon">🏛️</span>
              <div className="btn-text">
                <span className="btn-title">Association Info</span>
                <span className="btn-desc">News, Execs & Constitution</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      <footer className="hero-footer">
        <div className="news-ticker glass-card">
          <span className="ticker-label">LATEST:</span>
          <div className="ticker-scroll-container">
            <div className="ticker-content">
              {latestNews}
            </div>
          </div>
        </div>
        <div className="footer-credits">
          <p>© 2026 KATSESA ABU Zaria Chapter. All Rights Reserved.</p>
        </div>
      </footer>
    </main>
  );
}

export default Landing;
