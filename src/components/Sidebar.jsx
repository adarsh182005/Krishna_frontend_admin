import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const navItems = [
  { to: "/status", label: "System Status" },
  { to: "/products", label: "Manage Products" },
  { to: "/orders", label: "Manage Orders" },
];

const Sidebar = ({ isVisible, onClose }) => {
  const location = useLocation();

  return (
    <>
      <div 
        className={`lg:w-64 w-full h-screen bg-gray-800 text-white lg:fixed fixed top-0 left-0 transform transition-transform duration-300 ease-in-out z-30 ${isVisible ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-4 text-center text-2xl font-extrabold bg-black">
          Admin Panel
        </div>
        <nav className="mt-4 p-2">
          <ul>
            {navItems.map((item) => (
              <li key={item.to} className="mb-2">
                <Link 
                  to={item.to} 
                  onClick={onClose} // Close sidebar on link click
                  className={`block py-3 px-4 rounded-md transition duration-200 
                    ${location.pathname === item.to || (location.pathname === '/' && item.to === '/status')
                      ? 'bg-gray-700 font-semibold' 
                      : 'hover:bg-gray-700'
                    }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;