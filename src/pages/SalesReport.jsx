import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Mock Data Structure (for reference until API is ready)
// const mockTopSelling = [
//   { name: "Product A", totalUnitsSold: 450, totalRevenue: 90000 },
//   { name: "Product B", totalUnitsSold: 320, totalRevenue: 64000 },
// ];
// const mockMonthlySales = [
//   { month: "Jan 2024", revenue: 500000 },
//   { month: "Feb 2024", revenue: 550000 },
// ];

const SalesReport = () => {
  const [topSelling, setTopSelling] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('userToken');
    if (!token) {
      setError('Authentication token not found.');
      setLoading(false);
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      // 1. Fetch Top Selling Products
      const topSellingRes = await axios.get(`${backendUrl}/api/orders/top-selling`, config);
      setTopSelling(topSellingRes.data || []);
      
      // 2. Fetch Monthly Sales Data
      const monthlySalesRes = await axios.get(`${backendUrl}/api/orders/sales-by-month`, config);
      setMonthlySales(monthlySalesRes.data || []);

    } catch (err) {
      console.error('Failed to fetch sales reports:', err);
      // Display a general error message for the report section
      setError(err.response?.data?.message || 'Failed to fetch all sales data. Check API endpoints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen text-center">
        <p className="text-xl font-semibold text-blue-600 mt-10">Loading Sales Reports...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Sales Report</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      {/* Monthly Sales Overview - Bar/Line Chart Visualization */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Monthly Sales Overview</h2>
        
        {monthlySales.length > 0 ? (
          <div className="space-y-4">
            {/* Ideally, a chart library like Recharts would go here */}
            <p className="text-sm text-gray-500 italic">
              (A dynamic chart would typically be rendered here. Showing data in table format instead.)
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue (₹)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {monthlySales.map((sale, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-green-700">
                        ₹{sale.revenue.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No monthly sales data available. Please ensure your backend is configured for `/api/orders/sales-by-month`.</p>
        )}
      </div>

      {/* Top Selling Products - Table View */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Top Selling Products</h2>
        
        {topSelling.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue (₹)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topSelling.map((product, index) => (
                  <tr key={product._id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-blue-600">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">{product.totalUnitsSold}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-green-700">
                      ₹{product.totalRevenue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No top-selling product data available. Please ensure your backend is configured for `/api/orders/top-selling`.</p>
        )}
      </div>
    </div>
  );
};

export default SalesReport;
