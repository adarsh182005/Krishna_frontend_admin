import React from 'react';

const SalesReport = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Sales Report</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Monthly Sales Overview</h2>
        {/* Placeholder for a monthly sales chart */}
        <p className="text-gray-500">A detailed chart showing sales data by month will be placed here.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Top Selling Products</h2>
        {/* Placeholder for a table of top-selling products */}
        <p className="text-gray-500">A table listing the best-selling products goes here.</p>
      </div>
    </div>
  );
};

export default SalesReport;