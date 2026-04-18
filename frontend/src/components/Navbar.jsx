import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, User, Upload } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-dark-surface border-b border-dark-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                StudyVault
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/upload" className="hidden md:flex items-center space-x-1 text-slate-300 hover:text-white transition-colors">
                  <Upload className="h-5 w-5" />
                  <span>Upload</span>
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-slate-300 hover:text-white transition-colors">
                    Admin
                  </Link>
                )}
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-dark-border">
                  <Link to="/profile" className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                    <div className="bg-primary-900/50 p-1.5 rounded-full">
                      <User className="h-5 w-5 text-primary-400" />
                    </div>
                    <span className="hidden md:block font-medium">{user?.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
