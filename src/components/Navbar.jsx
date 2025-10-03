// src/components/Navbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userToken'); // Clear the token
    navigate('/login');
  };

  const isLoggedIn = localStorage.getItem('userToken');

  return (
    // Desktop (lg): Fixed position, full width, and starts after the sidebar (ml-64)
    // Mobile (Default): Full width, top of the screen.
    <nav className="bg-white p-4 shadow-md sticky top-0 z-20 lg:ml-64 transition-all duration-300">
      <div className="flex justify-between items-center">
        
        {/* Mobile menu button, visible only on small screens */}
        <button
            onClick={onMenuClick}
            className="p-2 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Open Menu"
        >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>

        {/* Title/Branding - Always Visible */}
        <h1 className="text-xl font-semibold text-gray-700">Dashboard Overview</h1>

        {/* Right Side: Login/Logout Button */}
        <div className="flex items-center space-x-4">
          
          {/* Conditional Login/Logout Button */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-black text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-800 transition duration-200"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-black text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-800 transition duration-200"
            >
              Login
            </button>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;