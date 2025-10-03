import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Component to display a simple modal for order details
const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-600';
      case 'shipped':
        return 'bg-blue-600';
      case 'processing':
        return 'bg-yellow-600';
      case 'pending':
        return 'bg-yellow-600';
      case 'cancelled':
        return 'bg-red-600';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start border-b pb-4 mb-4">
            <h2 className="text-3xl font-bold text-gray-800">Order Details <span className="text-blue-600 text-2xl font-normal">#{order._id.slice(-8)}</span></h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-900 transition duration-150"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Status and Total */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
              <p className="text-sm font-semibold text-gray-500">Total Amount</p>
              <p className="text-2xl font-extrabold text-green-700 mt-1">₹{order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
              <p className="text-sm font-semibold text-gray-500">Order Date</p>
              <p className="text-lg font-bold text-gray-800 mt-1">{formatDate(order.createdAt)}</p>
            </div>
            <div className="p-4 rounded-lg text-white font-bold flex items-center justify-center shadow-md" 
                // Note: The logic inside getStatusColor is for the modal, which uses solid colors.
                style={{ backgroundColor: getStatusColor(order.status) }}
            >
              <p className="text-xl uppercase">{order.status || 'N/A'}</p>
            </div>
          </div>

          {/* User & Shipping Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* User Details */}
            <div className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-2 border-b">Customer Info</h3>
              <p><span className="font-semibold">Name:</span> {order.user.name}</p>
              <p><span className="font-semibold">Email:</span> {order.user.email}</p>
              <p><span className="font-semibold">User ID:</span> {order.user._id.slice(-8)}</p>
            </div>

            {/* Shipping Address */}
            <div className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-2 border-b">Shipping Address</h3>
              {order.shippingAddress ? (
                <>
                  <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                  <p>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                </>
              ) : (
                <p>No shipping address provided.</p>
              )}
            </div>
          </div>

          {/* Order Items List */}
          <div className="p-4 border rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Items Ordered</h3>
            <div className="space-y-3">
              {order.orderItems?.length > 0 ? (
                order.orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center space-x-4">
                      {/* Using a simple image placeholder for demonstration */}
                      <img 
                        src={item.image || `https://placehold.co/50x50/3B82F6/FFFFFF?text=Item`} 
                        alt={item.name} 
                        className="w-12 h-12 rounded object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/50x50/FCA5A5/FFFFFF?text=X"; }}
                      />
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-700">{item.qty} x ₹{item.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No items found for this order.</p>
              )}
            </div>
          </div>

          {/* Footer/Close Button */}
          <div className="mt-8 text-right">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State to hold the order data for the modal
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${backendUrl}/api/orders`, config);
      // Assuming data is the array of orders
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders. Check backend connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [backendUrl]);
  
  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-200 text-yellow-800',
      'confirmed': 'bg-green-200 text-green-800',
      'processing': 'bg-blue-200 text-blue-800',
      'shipped': 'bg-purple-200 text-purple-800',
      'delivered': 'bg-green-200 text-green-800',
      'cancelled': 'bg-red-200 text-red-800',
      'payment_failed': 'bg-red-200 text-red-800'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-200 text-gray-800';
  };
  
  // Handler for the "View" button
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  // Handler to close the modal
  const handleCloseModal = () => {
    setSelectedOrder(null);
  };


  if (loading) return <p className="p-6 text-center text-lg text-blue-600">Loading orders...</p>;
  if (error) return <p className="p-6 text-center text-red-500 font-semibold">{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Orders</h1>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                User
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Total
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-900 font-medium">
                    {order._id.slice(-8)}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{order.user.name}</p>
                    <p className="text-gray-600 text-xs whitespace-no-wrap">{order.user.email}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-900">
                    ₹{order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className={`relative inline-block px-3 py-1 font-semibold text-xs leading-tight rounded-full ${getStatusColor(order.status)}`}>
                      {/* FIX: Ensure a fallback value is displayed if order.status is missing/null/empty */}
                      <span className="relative uppercase">{order.status || 'N/A'}</span>
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                    <button 
                      onClick={() => handleViewDetails(order)}
                      className="text-blue-600 hover:text-blue-800 font-medium transition duration-150 p-2 rounded-md hover:bg-blue-50"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal 
        order={selectedOrder} 
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ManageOrders;
