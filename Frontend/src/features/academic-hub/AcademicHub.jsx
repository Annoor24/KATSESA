import { useNavigate } from 'react-router-dom';

function AcademicHub() {
  const navigate = useNavigate();
  const levels = ['100L', '200L'];

  return (
    <div className="academic-hub-container">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h2 className="page-title">Academic Resource Hub</h2>
      </header>

      <div className="level-grid">
        {levels.map((level) => (
          <button 
            key={level} 
            className="level-card secondary-info"
            onClick={() => navigate(`/academic-hub/${level}`)}
          >
            <span className="level-icon">🎓</span>
            <div className="level-info">
              <span className="level-name">{level}</span>
              <span className="level-desc">Engineering Materials</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default AcademicHub;
