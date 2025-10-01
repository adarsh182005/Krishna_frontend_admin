// src/components/Navbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userToken'); // Clear the token
    navigate('/login');
  };

  const isLoggedIn = localStorage.getItem('userToken');

  return (
    // Desktop (lg): Fixed position, full width, and starts after the sidebar (ml-64)
    // Mobile (Default): Full width, top of the screen.
    <nav className="bg-white p-4 shadow-md sticky top-0 z-10 lg:ml-64 transition-all duration-300">
      <div className="flex justify-between items-center">
        
        {/* Title/Branding - Always Visible */}
        <h1 className="text-xl font-semibold text-gray-700">Dashboard Overview</h1>

        {/* Right Side: Search and User Profile */}
        <div className="flex items-center space-x-4">
          
          {/* Search Input - Hidden on small screens */}
          <input
            type="text"
            placeholder="Search..."
            className="hidden lg:block w-64 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          
          {/* Conditional Login/Logout Button */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition duration-200"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700 transition duration-200"
            >
              Login
            </button>
          )}

          {/* User Profile Icon */}
          <div className="relative">
            <button 
              className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              title="User Profile"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;