import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Executives() {
  const navigate = useNavigate();
  
  const execs = [
    { name: 'Danmallam Hussain Muhammad', role: 'President', dept: 'Electronics & Telecommunication Engineering', level: '500L', image: '/assets/execs/President.jpg' },
    { name: 'Bello Abdulkadir Bindawa', role: 'Vice President I', dept: 'Civil Engineering', level: '400L', image: '/assets/execs/VP I.jpg' },
    { name: 'Aisha Hassan Labo', role: 'Vice President II', dept: 'Chemical Engineering', level: '300L', image: '/assets/execs/VP II.jpg' },
    { name: 'Ibrahim Aminu Abubakar', role: 'Secretary General', dept: 'Civil Engineering', level: '400L', image: '/assets/execs/Sect. Gen.jpg' },
    { name: 'Munira Munir Runka', role: 'Asst. Secretary General', dept: 'Chemical Engineering', level: '400L', image: '👤' },
    { name: 'Ahmad Sani Yahya', role: 'PRO I', dept: 'Computer Engineering', level: '400L', image: '/assets/execs/PRO I.jpg' },
    { name: 'Abdulmalik Tanimu', role: 'PRO II', dept: 'Civil Engineering', level: '300L', image: '/assets/execs/PRO II.jpg' },
    { name: 'Ibrahim Sani Isa', role: 'Financial Secretary', dept: 'Civil Engineering', level: '400L', image: '/assets/execs/Fin. Sec.jpg' },
    { name: "Fatima Saeed Shu'aibu", role: 'Treasurer', dept: 'Mining Engineering', level: '200L', image: '/assets/execs/Treasurer.jpg' },
    { name: "Nuruddin Kabir", role: 'Academic Director I', dept: 'Electrical Engineering', level: '500L', image: '/assets/execs/AcademicDirector I.jpg' },
    { name: "Muhammad Bello Kabir", role: 'Academic Director II', dept: 'Civil Engineering', level: '400L', image: '👤' },
    { name: "Sani Bashir", role: 'Auditor General', dept: 'Civil Engineering', level: '400L', image: '/assets/execs/Auditor General.jpg' },
    { name: "Aminu Ibrahim", role: 'Welfare Director', dept: 'Civil Engineering', level: '200L', image: '/assets/execs/Welfare Director.jpg' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % execs.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + execs.length) % execs.length);
  };

  const getCardClass = (index) => {
    const isMobile = window.innerWidth <= 768;
    if (index === currentIndex) return 'exec-card active glass-card';
    if (index === (currentIndex - 1 + execs.length) % execs.length) return 'exec-card prev glass-card';
    if (index === (currentIndex + 1) % execs.length) return 'exec-card next glass-card';
    return isMobile ? 'exec-card hidden' : 'exec-card hidden';
  };

  return (
    <div className="executives-container">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate('/association')}>
          ← Back
        </button>
        <h2 className="page-title">Current Executives</h2>
      </header>

      <div className="carousel-stage">
        <button className="carousel-nav-btn prev-btn" onClick={handlePrev}>‹</button>
        
        <div className="exec-carousel-track">
          {execs.map((exec, index) => (
            <div key={exec.name} className={getCardClass(index)}>
              <div className="exec-avatar">
                {exec.image && (exec.image.startsWith('/') || exec.image.startsWith('http')) ? (
                  <img src={exec.image} alt={exec.name} className="exec-photo" />
                ) : (
                  exec.image
                )}
              </div>
              <div className="exec-info">
                <h4 className="exec-name">{exec.name}</h4>
                <p className="exec-role">{exec.role}</p>
                <div className="exec-meta">
                  <span className="exec-dept">{exec.dept}</span>
                  <span className="exec-level-badge">{exec.level}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-nav-btn next-btn" onClick={handleNext}>›</button>
      </div>

      <div className="carousel-indicators">
        {execs.map((_, idx) => (
          <span 
            key={idx} 
            className={`dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default Executives;
