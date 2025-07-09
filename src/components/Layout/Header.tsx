import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userProfile, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            ProjectX
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`transition-colors hover:text-blue-600 ${isActive('/') ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
            >
              Home
            </Link>
            <Link 
              to="/projects" 
              className={`transition-colors hover:text-blue-600 ${isActive('/projects') ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
            >
              Projects
            </Link>
            <Link 
              to="/services" 
              className={`transition-colors hover:text-blue-600 ${isActive('/services') ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
            >
              Services
            </Link>
            {user && (
              <Link 
                to="/contact" 
                className={`transition-colors hover:text-blue-600 ${isActive('/contact') ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
              >
                Contact
              </Link>
            )}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {userProfile?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`transition-colors hover:text-blue-600 ${isActive('/') ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/projects" 
                className={`transition-colors hover:text-blue-600 ${isActive('/projects') ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>
              <Link 
                to="/services" 
                className={`transition-colors hover:text-blue-600 ${isActive('/services') ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              {user && (
                <Link 
                  to="/contact" 
                  className={`transition-colors hover:text-blue-600 ${isActive('/contact') ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              )}
              
              {user ? (
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  {userProfile?.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="flex items-center space-x-2 text-orange-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <Link 
                    to="/dashboard" 
                    className="flex items-center space-x-2 text-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button 
                    onClick={() => {handleLogout(); setIsMenuOpen(false);}}
                    className="flex items-center space-x-2 text-gray-700"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <Link 
                    to="/login" 
                    className="text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-lg inline-block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;