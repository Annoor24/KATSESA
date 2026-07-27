import { Routes, Route } from 'react-router-dom';
import Landing from './features/landing/Landing';
import AcademicHub from './features/academic-hub/AcademicHub';
import LevelView from './features/academic-hub/LevelView';
import ResourceList from './features/academic-hub/ResourceList';
import AssociationInfo from './features/association/AssociationInfo';
import Executives from './features/association/Executives';
import Constitution from './features/association/Constitution';
import Newsboard from './features/association/Newsboard';
import EventsArchive from './features/association/EventsArchive';
import Login from './features/admin/Login';
import AdminDashboard from './features/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import logo from './assets/katsesa-logo.png';
import './index.css';

function App() {
  return (
    <div className="app-container">
      {/* Background Watermark Overlay */}
      <div className="bg-watermark">
        <img src={logo} alt="KATSESA Watermark" />
      </div>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/academic-hub" element={<AcademicHub />} />
        <Route path="/academic-hub/:level" element={<LevelView />} />
        <Route path="/academic-hub/:level/:semester/:dept" element={<ResourceList />} />
        <Route path="/association" element={<AssociationInfo />} />
        <Route path="/association/executives" element={<Executives />} />
        <Route path="/association/constitution" element={<Constitution />} />
        <Route path="/association/news" element={<Newsboard />} />
        <Route path="/association/events" element={<EventsArchive />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
