import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchResources } from '../../api/api';

function Constitution() {
  const navigate = useNavigate();
  const [constDoc, setConstDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConstitution = async () => {
      const allResources = await fetchResources();
      // Look for a resource uploaded to 'General' level with 'Constitution' in its name or category
      const found = allResources.find(r => 
        r.level === 'General' && 
        (r.category?.toLowerCase().includes('constitution') || r.title?.toLowerCase().includes('constitution'))
      );
      setConstDoc(found);
      setLoading(false);
    };
    loadConstitution();
  }, []);

  return (
    <div className="constitution-container">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate('/association')}>
          ← Back
        </button>
        <h2 className="page-title">Constitution</h2>
      </header>

      <div className="doc-viewer glass-card">
        <div className="doc-header">
          <h3>KATSESA ABU ZARIA CHAPTER CONSTITUTION</h3>
        </div>
        
        <div className="doc-content">
          <section className="doc-section">
            <h4>Article I: Name, Motto, and Supremacy</h4>
            <div className="summary-section">
              <p><strong>Motto:</strong> "Towards Developing Engineering and Technology in Katsina State"</p>
              <p>This constitution is the supreme governing document for all KATSESA members, binding on everyone subject to University rules and regulations.</p>
            </div>
          </section>

          <section className="doc-section">
            <h4>Article III: Aims and Objectives</h4>
            <ul className="summary-list">
              <li>To promote and propel the development of Engineering and Technology in Katsina State.</li>
              <li>To enhance proximity between members, alumni, the Faculty, and the Katsina State Government.</li>
              <li>To cater for the welfare of members and foster mutual understanding.</li>
              <li>To promote academic excellence and highlight the engineering profession to the public.</li>
            </ul>
          </section>

          <section className="doc-section">
            <h4>Article IV: Membership</h4>
            <p>Membership is open to all indigenes of Katsina State who are matriculated students of the Faculty of Engineering at Ahmadu Bello University, Zaria.</p>
            <p><small>Members must be registered with the Dean of Students Affairs, NAKATSS, and the Faculty.</small></p>
          </section>

          <section className="doc-section">
            <h4>Article II: Interpretation</h4>
            <p>The Executive Council, presided over by the President, holds the power to interpret rules and provisions of this constitution, subject to Parliament approval.</p>
          </section>
          
          <div className="doc-placeholder">
            {loading ? (
              <p>Loading document details...</p>
            ) : constDoc ? (
              <>
                <p>The official constitution is available for download.</p>
                <a 
                  href={constDoc.url}
                  download="KATSESA-Constitution.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-btn"
                  style={{ textDecoration: 'none', display: 'inline-block' }}
                >
                  Download Full PDF
                </a>
              </>
            ) : (
              <p>The full document is being formatted for digital viewing.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Constitution;
