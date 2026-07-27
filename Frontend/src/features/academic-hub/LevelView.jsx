import { useParams, useNavigate } from 'react-router-dom';

function LevelView() {
  const { level } = useParams();
  const navigate = useNavigate();

  const semesters = [
    { id: '1', name: 'First Semester', icon: '📝' },
    { id: '2', name: 'Second Semester', icon: '📝' }
  ];

  return (
    <div className="level-view-container">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate('/academic-hub')}>
          ← Back to Levels
        </button>
        <h2 className="page-title">{level} Portal</h2>
      </header>

      <section className="semester-selection">
        <h3 className="sub-title">Select Semester</h3>
        <div className="semester-grid">
          {semesters.map((semester) => (
            <button 
              key={semester.id} 
              className="semester-card glass-card"
              onClick={() => navigate(`/academic-hub/${level}/${semester.id}/General`)}
            >
              <span className="sem-icon">{semester.icon}</span>
              <span className="sem-name">{semester.name}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default LevelView;
