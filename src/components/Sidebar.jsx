// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/products", label: "Manage Products" },
  { to: "/orders", label: "Manage Orders" },
  { to: "/sales-report", label: "Sales Report" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    // Responsive Styling: hidden by default (mobile), fixed and visible on large screens (lg:)
    <div className="lg:w-64 w-full h-screen bg-gray-800 text-white lg:fixed hidden lg:block z-20">
      <div className="p-4 text-center text-2xl font-extrabold bg-blue-600">
        Admin Panel
      </div>
      <nav className="mt-4 p-2">
        <ul>
          {navItems.map((item) => (
            <li key={item.to} className="mb-2">
              <Link 
                to={item.to} 
                className={`block py-3 px-4 rounded-md transition duration-200 
                  ${location.pathname === item.to 
                    ? 'bg-blue-700 font-semibold' 
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
  );
};

export default Sidebar;