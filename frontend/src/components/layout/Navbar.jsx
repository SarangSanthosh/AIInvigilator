import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = isAuthenticated
    ? [
        { to: '/dashboard', label: 'Dashboard', icon: '📊' },
        { to: '/malpractice-logs', label: 'Malpractice Logs', icon: '⚠️' },
        { to: '/lecture-halls', label: 'Lecture Halls', icon: '🏛️' },
        { to: '/profile', label: 'Profile', icon: '👤' },
      ]
    : [
        { to: '/', label: 'Home', icon: '🏠' },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-800 sticky top-0 z-50 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl">🎓</span>
            <span className="text-2xl font-bold gradient-text">AI Invigilator</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 flex-1 justify-end">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  flex items-center space-x-1 px-4 py-2 rounded-full transition-all duration-300
                  ${isActive(link.to) 
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-lg' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700'
                  }
                `}
              >
                <span>{link.icon}</span>
                <span className="font-semibold">{link.label}</span>
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l-2 border-gray-300 dark:border-gray-600">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Welcome, <span className="font-semibold">{user?.username}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 btn-gradient"
              >
                Get Alerted
              </Link>
            )}

            {/* Theme Toggle - Far Right */}
            <button
              onClick={toggleTheme}
              className="ml-4 p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700 transition-all duration-300 text-2xl"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center space-x-2 px-4 py-3 rounded-xl my-1 transition-all duration-300
                  ${isActive(link.to) 
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700'
                  }
                `}
              >
                <span>{link.icon}</span>
                <span className="font-semibold">{link.label}</span>
              </Link>
            ))}

            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center space-x-2 px-4 py-3 rounded-xl my-1 text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700 transition-all duration-300"
            >
              <span>{isDark ? '☀️' : '🌙'}</span>
              <span className="font-semibold">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                  Welcome, <span className="font-semibold">{user?.username}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 mt-2"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center mt-2 btn-gradient"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
