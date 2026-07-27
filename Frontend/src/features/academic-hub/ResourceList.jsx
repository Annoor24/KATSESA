import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchResources } from '../../api/api';

const ADMIN_WHATSAPP = "2348000000000"; // REPLACE WITH ACTUAL NUMBER

function ResourceList() {
  const { level, dept, semester } = useParams();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchResources().then(data => {
      const filtered = data.filter(res => 
        res.level === level && 
        res.semester === semester &&
        (dept === 'all' || res.dept === dept || res.dept === 'General')
      );
      setResources(filtered);
      setLoading(false);
    });
  }, [level, dept, semester]);

  const handleRequest = () => {
    const message = `Hello KATSESA Admin, I'm looking for a material for ${level}, ${semester === '1' ? 'First' : 'Second'} Semester ${dept !== 'all' ? `(${dept})` : ''}. Specifically: `;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${encoded}`, '_blank');
  };

  const openPreview = (url) => {
    setPreviewUrl(url);
    document.body.style.overflow = 'hidden';
  };

  const closePreview = () => {
    setPreviewUrl(null);
    document.body.style.overflow = 'auto';
  };

  const handleDownload = (url) => {
    // We now rely on 'contentDisposition: attachment' metadata set during upload.
    // For existing files or fallback, we open in a new tab which triggers the download prompt.
    window.open(url, '_blank');
  };

  const filteredItems = resources.filter(res => 
    res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (res.category && res.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Group by category
  const groupedResources = filteredItems.reduce((acc, res) => {
    const cat = res.category || 'General Resources';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(res);
    return acc;
  }, {});

  return (
    <div className="resource-list-container">
      {/* PDF Preview Modal */}
      {previewUrl && (
        <div className="preview-modal-overlay" onClick={closePreview}>
          <div className="preview-modal-content" onClick={e => e.stopPropagation()}>
            <div className="preview-header">
              <h3>Document Preview</h3>
              <button className="close-preview-btn" onClick={closePreview}>✕</button>
            </div>
            <iframe 
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewUrl)}&embedded=true`} 
              title="Document Preview"
              className="preview-iframe"
            ></iframe>
            <div className="preview-footer">
              <p>Some PDF features may be limited in preview mode.</p>
              <button 
                onClick={() => handleDownload(previewUrl)} 
                className="action-btn download-btn"
              >
                Download Full File
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="page-header">
        <button 
          className="back-button" 
          onClick={() => selectedCategory ? setSelectedCategory(null) : navigate(-1)}
        >
          {selectedCategory ? '← Back to Folders' : '← Back'}
        </button>
        <div className="header-text">
          <h2 className="page-title">
            {selectedCategory ? selectedCategory : (dept === 'all' ? 'General Resources' : dept)}
          </h2>
          <p className="sub-header">{level} | {semester === '1' ? 'First' : 'Second'} Semester</p>
        </div>
      </header>

      {!selectedCategory && (
        <div className="search-bar-container">
          <input 
            type="text" 
            placeholder="Search folders or materials..." 
            className="search-input glass-card"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      )}

      <div className="resources-content">
        {loading ? (
          <p className="loading-text">Scanning for materials...</p>
        ) : filteredItems.length > 0 ? (
          !selectedCategory ? (
            /* Folder Selection View */
            <div className="folders-grid">
              {Object.keys(groupedResources).map(category => (
                <button 
                  key={category} 
                  className="folder-card glass-card"
                  onClick={() => setSelectedCategory(category)}
                >
                  <div className="folder-icon">📂</div>
                  <div className="folder-info">
                    <span className="folder-name">{category}</span>
                    <span className="folder-count">{groupedResources[category].length} items</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* List of Materials in Folder View */
            <div className="resources-grid">
              {groupedResources[selectedCategory].map((res) => (
                <div key={res.id} className="resource-item glass-card">
                  <div className="res-icon">{res.type === 'PDF' ? '📕' : '📄'}</div>
                  <div className="res-details">
                    <h4 className="res-title">{res.title}</h4>
                    <p className="res-meta">{res.type} • {res.size} • {res.year}</p>
                  </div>
                  <div className="res-actions">
                    <button onClick={() => openPreview(res.url)} className="action-btn preview-btn">Preview</button>
                    <button 
                      onClick={() => handleDownload(res.url)} 
                      className="action-btn download-btn"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="no-resources glass-card">
            <p>No materials found matching your search.</p>
          </div>
        )}
      </div>

      <div className="request-section glass-card">
        <p>Can't find what you're looking for?</p>
        <button className="request-btn" onClick={handleRequest}>Request Material</button>
      </div>
    </div>
  );
}

export default ResourceList;
