import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, DollarSign, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const SystemStatus = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchStats = async () => {
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
        // This endpoint fetches general stats from your backend
        const { data } = await axios.get(`${backendUrl}/api/orders/stats`, config);
        setStats(data);
      } catch (err) {
        console.error('Error fetching system stats:', err);
        setError(err.response?.data?.message || 'Failed to fetch backend statistics. Check API endpoint /api/orders/stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [backendUrl]);

  const StatCard = ({ icon, title, value, colorClass }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4" style={{ borderColor: colorClass }}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-500 uppercase">{title}</div>
        {React.cloneElement(icon, { className: `w-6 h-6 ${colorClass}` })}
      </div>
      <p className="mt-1 text-3xl font-bold text-gray-900">
        {title === "Total Revenue" ? `₹${(value || 0).toFixed(2)}` : value || 0}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 text-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mt-20"></div>
        <p className="text-xl font-semibold text-blue-600 mt-4">Loading System Status...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-2">Application Health Overview</h1>
      
      {error && (
        <div className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<ShoppingBag />}
          title="Total Orders"
          value={stats?.totalOrders}
          colorClass="text-blue-600"
        />
        <StatCard 
          icon={<DollarSign />}
          title="Total Revenue"
          value={stats?.totalRevenue}
          colorClass="text-green-600"
        />
        <StatCard 
          icon={<Clock />}
          title="Pending Orders"
          value={stats?.pendingOrders}
          colorClass="text-yellow-600"
        />
        <StatCard 
          icon={<CheckCircle />}
          title="Delivered Orders"
          value={stats?.deliveredOrders}
          colorClass="text-purple-600"
        />
      </div>

      <div className="mt-10 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Quick Information</h2>
        <p className="text-gray-600">This dashboard uses the dedicated order statistics endpoint (`/api/orders/stats`) to quickly verify system health and key metrics without relying on the complex reporting endpoints that were causing instability.</p>
      </div>
    </div>
  );
};

export default SystemStatus;