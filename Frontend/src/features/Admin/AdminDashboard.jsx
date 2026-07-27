import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "../../firebase/config";
import { 
  fetchResources, updateResource, deleteResource, 
  fetchNews, updateNews, deleteNews,
  fetchEvents, updateEvent, deleteEvent 
} from '../../api/api';

function AdminDashboard() {
  const [adminMode, setAdminMode] = useState('upload'); // upload, manage
  const [uploadType, setUploadType] = useState('Resource'); // Resource, News, Event
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  const [files, setFiles] = useState([]);
  const [level, setLevel] = useState('100L');
  const [semester, setSemester] = useState('1');
  const [resourceCategory, setResourceCategory] = useState('');
  const [newsCategory, setNewsCategory] = useState('General');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [manageSearchTerm, setManageSearchTerm] = useState('');
  const [selectedManageCategory, setSelectedManageCategory] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar state
  const [currentUploadIndex, setCurrentUploadIndex] = useState(0); // For batch progress
  const navigate = useNavigate();

  useEffect(() => {
    if (adminMode === 'manage') {
      loadItems();
      setSelectedManageCategory(null);
      setManageSearchTerm('');
    }
  }, [adminMode, uploadType]);

  const loadItems = async () => {
    let data = [];
    if (uploadType === 'Resource') data = await fetchResources();
    else if (uploadType === 'News') data = await fetchNews();
    else if (uploadType === 'Event') data = await fetchEvents();
    setItems(data);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
    setContent(item.content || item.description || '');
    if (uploadType === 'Resource') {
      setLevel(item.level);
      setSemester(item.semester);
      setResourceCategory(item.category || '');
    } else if (uploadType === 'News') {
      setNewsCategory(item.category);
    }
    setAdminMode('upload');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    let success = false;
    if (uploadType === 'Resource') success = await deleteResource(id);
    else if (uploadType === 'News') success = await deleteNews(id);
    else if (uploadType === 'Event') success = await deleteEvent(id);
    
    if (success) {
      alert('Deleted successfully!');
      loadItems();
    }
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleBulkUpload = async () => {
    if (uploading) return;
    if (!title && uploadType !== 'Resource') {
      alert(`Please enter a ${uploadType === 'News' ? 'Headline' : 'Event Title'}`);
      return;
    }
    if (!editingId && uploadType !== 'News' && files.length === 0) {
      alert(`Please select ${uploadType === 'Resource' ? 'materials' : 'photos'} to upload`);
      return;
    }
    setUploading(true);

    try {
      if (editingId) {
        // Update Logic
        const updateData = { title };
        if (uploadType === 'Resource') {
          updateData.level = level;
          updateData.semester = semester;
          updateData.category = resourceCategory;
        } else if (uploadType === 'News') {
          updateData.content = content;
          updateData.category = newsCategory;
        } else if (uploadType === 'Event') {
          updateData.description = content;
        }

        let success = false;
        if (uploadType === 'Resource') success = await updateResource(editingId, updateData);
        else if (uploadType === 'News') success = await updateNews(editingId, updateData);
        else if (uploadType === 'Event') success = await updateEvent(editingId, updateData);

        if (success) alert('Updated successfully!');
      } else {
        // Create Logic (Existing)
        if (uploadType === 'Resource') {
          let count = 0;
          for (const file of files) {
            setCurrentUploadIndex(count);
            // We NO LONGER rename the file for download. metadata uses original file.name
            const storageRef = ref(storage, `materials/${level}/Sem_${semester}/${file.name}`);
            
            // FIX: Use original file.name for download
            const metadata = { 
              contentDisposition: `attachment; filename="${file.name}"` 
            };
            
            const uploadTask = uploadBytesResumable(storageRef, file, metadata);

            await new Promise((resolve, reject) => {
              uploadTask.on('state_changed', 
                (snapshot) => {
                  const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  setProgress(Math.round(p));
                }, 
                (error) => reject(error), 
                async () => {
                  const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                  await addDoc(collection(db, "academic_resources"), {
                    title: title || file.name.split('.')[0].replace(/_/g, ' '),
                    type: file.name.split('.').pop().toUpperCase(),
                    size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                    year: new Date().getFullYear().toString(),
                    level, semester, url: downloadURL, dept: 'General',
                    category: resourceCategory || 'General'
                  });
                  resolve();
                }
              );
            });
            count++;
            setCurrentUploadIndex(count);
          }
        } else if (uploadType === 'News') {
          await addDoc(collection(db, "association_news"), {
            title,
            content,
            category: newsCategory,
            date: new Date().toLocaleDateString(),
            fullTimestamp: new Date().toLocaleString()
          });
        } else if (uploadType === 'Event') {
          const imageUrls = [];
          let count = 0;
          for (const file of files) {
            setCurrentUploadIndex(count);
            // Events can behave normally, or use same logic if needed. keeping as is mostly.
            const cleanFileName = (title || file.name).split('.')[0].replace(/_/g, ' ') + '.' + file.name.split('.').pop();
            const storageRef = ref(storage, `events/${title}/${file.name}`);
            const metadata = { 
              contentDisposition: `attachment; filename="${cleanFileName}"` 
            };
            const uploadTask = uploadBytesResumable(storageRef, file, metadata);
            const url = await new Promise((resolve, reject) => {
              uploadTask.on('state_changed', null, reject, async () => {
                resolve(await getDownloadURL(uploadTask.snapshot.ref));
              });
            });
            imageUrls.push(url);
            count++;
            setCurrentUploadIndex(count);
          }
          await addDoc(collection(db, "events_archive"), {
            title,
            description: content,
            date: new Date().toLocaleDateString(),
            images: imageUrls
          });
        }
        alert(`${uploadType} added successfully!`);
      }
      resetForm();
    } catch (error) {
      console.error(error);
      alert('Error during process.');
    } finally {
      setUploading(false);
      setProgress(0);
      setCurrentUploadIndex(0);
    }
  };



  const resetForm = () => {
    setFiles([]);
    resetFormFields();
    setEditingId(null);
  };

  const resetFormFields = () => {
    setTitle('');
    setContent('');
    setResourceCategory('');
    setProgress(0);
  };


  return (
    <div className="admin-container">
      <header className="page-header">
        <div className="header-info">
          <h2 className="page-title">Executive Dashboard</h2>
          <p className="sub-header">Manage Association Content & Resources</p>
        </div>
        <button className="back-button" onClick={() => navigate('/')}>
          Log Out
        </button>
      </header>

      {/* Mobile Header */}
      <div className="admin-mobile-header glass-card">
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? '✕' : '☰'}
        </button>
        <h2 className="mobile-admin-title">Admin Panel</h2>
      </div>

      <div className="admin-dashboard-layout">
        {/* Overlay for mobile sidebar */}
        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

        {/* Sidebar Navigation */}
        <aside className={`admin-sidebar glass-card ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-section">
            <p className="sidebar-label" style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '0.5rem', paddingLeft: '1rem' }}>ACTIONS</p>
            <button 
              className={`sidebar-nav-item ${adminMode === 'upload' ? 'active' : ''}`}
              onClick={() => { setAdminMode('upload'); resetForm(); setSidebarOpen(false); }}
            >
              <span className="sidebar-icon">{editingId ? '✍️' : '➕'}</span>
              {editingId ? 'Edit Item' : 'Add Content'}
            </button>
            <button 
              className={`sidebar-nav-item ${adminMode === 'manage' ? 'active' : ''}`}
              onClick={() => { setAdminMode('manage'); setSidebarOpen(false); }}
            >
              <span className="sidebar-icon">🛠️</span>
              Manage All
            </button>
          </div>

          <div className="sidebar-section" style={{ marginTop: '2rem' }}>
            <p className="sidebar-label" style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '0.5rem', paddingLeft: '1rem' }}>CATEGORIES</p>
            {['Resource', 'News', 'Event'].map(t => (
              <button 
                key={t}
                className={`sidebar-nav-item ${uploadType === t ? 'active-type' : ''}`}
                style={uploadType === t ? { background: 'rgba(255,255,255,0.05)', color: 'white' } : {}}
                onClick={() => { setUploadType(t); setSidebarOpen(false); }}
              >
                <span className="sidebar-icon">{t === 'Resource' ? '📚' : (t === 'News' ? '📰' : '📅')}</span>
                {t === 'News' ? 'News' : t + 's'}
              </button>
            ))}
          </div>
          


          <div className="sidebar-footer" style={{ marginTop: 'auto', padding: '1rem' }}>
             <button className="sidebar-nav-item" onClick={() => navigate('/')} style={{ width: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
               🚪 Exit Admin
             </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="admin-main-content">
          {adminMode === 'upload' ? (
            <div className="admin-card glass-card" style={{ padding: '2rem' }}>
              <div className="admin-card-header">
                <h3>{editingId ? `Edit ${uploadType}` : `New ${uploadType === 'News' ? 'News' : uploadType}`}</h3>
                {editingId && <span className="edit-indicator" style={{ color: 'var(--gear-orange)', fontSize: '0.8rem' }}>Currently Editing: {editingId}</span>}
              </div>

              <div className="upload-form">
                <div className="form-fields">
                  {uploadType === 'Resource' && (
                    <div className="form-row">
                      <div className="form-group">
                        <label>Academic Level</label>
                        <select className="form-select" value={level} onChange={(e) => setLevel(e.target.value)}>
                          <option value="100L">100L</option>
                          <option value="200L">200L</option>
                          <option value="General">General/Official</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Semester</label>
                        <select className="form-select" value={semester} onChange={(e) => setSemester(e.target.value)}>
                          <option value="1">First Semester</option>
                          <option value="2">Second Semester</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {uploadType === 'Resource' && (
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                      <label>Folder / Category</label>
                      <input 
                        className="form-input"
                        type="text" 
                        placeholder="e.g. Lecture Notes, Past Questions, Tutorials..."
                        value={resourceCategory} 
                        onChange={(e) => setResourceCategory(e.target.value)} 
                      />
                    </div>
                  )}

                  {uploadType === 'News' && (
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                      <label>News Category</label>
                      <select className="form-select" value={newsCategory} onChange={(e) => setNewsCategory(e.target.value)}>
                        <option value="General">General News</option>
                        <option value="Exams">Exams & Results</option>
                        <option value="Meetings">Official Meetings</option>
                        <option value="Deadlines">Deadlines</option>
                      </select>
                    </div>
                  )}

                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label>{uploadType === 'News' ? 'Headline' : (uploadType === 'Event' ? 'Event Title' : 'Material Title')}</label>
                    <input 
                      className="form-input"
                      type="text" 
                      placeholder={uploadType === 'Resource' ? 'e.g. MEE 201 Course Note' : 'Enter title...'}
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                    />
                  </div>

                  {(uploadType === 'News' || uploadType === 'Event') && (
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                      <label>{uploadType === 'News' ? 'Content' : 'Description'}</label>
                      <textarea 
                        className="form-textarea"
                        rows="6" 
                        placeholder="Write details here..."
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                      />
                    </div>
                  )}

                  {!editingId && uploadType !== 'News' && (
                    <div className="form-group">
                      <label>{uploadType === 'Resource' ? 'Upload Files' : 'Event Photos'}</label>
                      <div className="file-dropzone" onClick={() => document.getElementById('file-upload').click()}>
                        <input 
                          type="file" 
                          multiple 
                          style={{ display: 'none' }}
                          onChange={handleFileChange} 
                          id="file-upload"
                        />
                        <div className="dropzone-content">
                          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📤</span>
                          <p>{files.length > 0 ? `${files.length} files selected` : `Click to select ${uploadType === 'Resource' ? 'Academic Materials' : 'Event Photos'}`}</p>
                          <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>PDF, DOCX, JPG, PNG supported</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {uploading && (
                  <div className="progress-bar-container">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    <span className="progress-text">
                      {progress}% Processing... 
                      {files.length > 1 && ` (File ${currentUploadIndex + 1} of ${files.length})`}
                    </span>
                  </div>
                )}

                <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center' }}>
                  <button 
                    className="btn-publish-main" 
                    onClick={handleBulkUpload}
                    disabled={uploading}
                  >
                    {uploading ? 'Processing...' : (editingId ? 'Save Changes' : 'Publish Now')}
                  </button>
                  {editingId && (
                    <button className="back-button" onClick={resetForm} disabled={uploading}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="manage-list-area">
              <div className="admin-card-header">
                <h3>
                  {selectedManageCategory ? `📂 ${selectedManageCategory}` : `Manage ${uploadType === 'News' ? 'News' : uploadType + 's'}`}
                </h3>
                <div className="manage-header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {selectedManageCategory && (
                    <button 
                      className="back-button" 
                      onClick={() => setSelectedManageCategory(null)}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      ← Back to Folders
                    </button>
                  )}
                  <span className="count-badge glass-card" style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}>
                    {items.length} items Found
                  </span>
                </div>
              </div>

              {/* Management Search Bar */}
              <div className="manage-search-container" style={{ marginBottom: '2rem', maxWidth: '500px' }}>
                <input 
                  type="text" 
                  placeholder={selectedManageCategory ? `Search in ${selectedManageCategory}...` : "Search by title or category..."}
                  className="form-input glass-card"
                  value={manageSearchTerm}
                  onChange={(e) => setManageSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px' }}
                />
              </div>
              
              <div className="manage-grid">
                {(() => {
                  const filtered = items.filter(item => 
                    item.title.toLowerCase().includes(manageSearchTerm.toLowerCase()) ||
                    (item.category && item.category.toLowerCase().includes(manageSearchTerm.toLowerCase()))
                  );

                  if (uploadType === 'Resource' && !selectedManageCategory && !manageSearchTerm) {
                    // Show folders if no search and no folder selected
                    const grouped = filtered.reduce((acc, res) => {
                      const cat = res.category || 'General Resources';
                      if (!acc[cat]) acc[cat] = [];
                      acc[cat].push(res);
                      return acc;
                    }, {});

                    return Object.keys(grouped).map(cat => (
                      <div 
                        key={cat} 
                        className="manage-card folder-manage-card glass-card"
                        onClick={() => setSelectedManageCategory(cat)}
                        style={{ cursor: 'pointer', textAlign: 'center', padding: '1.5rem' }}
                      >
                        <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>📂</span>
                        <h4 style={{ margin: '0.5rem 0' }}>{cat}</h4>
                        <p style={{ fontSize: '0.75rem', opacity: 0.5 }}>{grouped[cat].length} items</p>
                      </div>
                    ));
                  }

                  // Filter by folder if selected
                  const finalDisplayItems = (uploadType === 'Resource' && selectedManageCategory)
                    ? filtered.filter(item => (item.category || 'General Resources') === selectedManageCategory)
                    : filtered;

                  return finalDisplayItems.length > 0 ? finalDisplayItems.map(item => (
                    <div key={item.id} className="manage-card glass-card">
                      <div className="manage-card-info">
                        <h4>{item.title}</h4>
                        <p className="manage-card-meta">
                          {uploadType === 'Resource' ? `${item.level} • ${item.category || 'General'}` : item.date}
                          {uploadType === 'News' && ` • ${item.category}`}
                        </p>
                      </div>
                      <div className="manage-card-actions">
                        <button className="action-btn btn-edit" onClick={() => handleEdit(item)}>
                          Edit
                        </button>
                        <button className="action-btn btn-delete" onClick={() => handleDelete(item.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="no-items glass-card" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1 / -1' }}>
                      <p style={{ opacity: 0.5 }}>No matching {uploadType.toLowerCase()}s found.</p>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
