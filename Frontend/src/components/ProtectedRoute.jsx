import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  if (loading) {
    return <div className="loading-screen">Authenticating...</div>;
  }

  return user ? children : null;
}

export default ProtectedRoute;
