import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UploadResource from './pages/UploadResource';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

function App() {
  const { isAuthenticated, user } = useAuthStore();

  const ProtectedRoute = ({ children, roleRequired }) => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (roleRequired && user?.role !== roleRequired) return <Navigate to="/" />;
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen bg-dark-bg flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />
            <Route 
              path="/upload" 
              element={
                <ProtectedRoute>
                  <UploadResource />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute roleRequired="admin">
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #334155'
            }
          }}
        />
      </div>
    </Router>
  );
}

export default App;
