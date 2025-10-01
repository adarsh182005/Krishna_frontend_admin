import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchProducts = async () => {
    // Defensive check to prevent API call if URL is not defined
    if (!backendUrl) {
      setError('Backend URL is not configured. Please check your .env file.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${backendUrl}/api/products`);
      // Ensure the response data is an array before setting state
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
        setError('Unexpected data format from server.');
      }
    } catch (err) {
      setError('Failed to fetch products.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [backendUrl]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormVisible(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsFormVisible(true);
  };

  const handleDeleteProduct = async (id) => {
    // Defensive check
    if (!backendUrl) {
      alert('Backend URL is not configured. Cannot perform action.');
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${backendUrl}/api/products/${id}`, config);
      fetchProducts(); // Refresh the list
    } catch (err) {
      console.error('Failed to delete product', err);
      alert('Failed to delete product. Check console for details.');
    }
  };

  const handleFormSubmit = async (formData) => {
    // Defensive check
    if (!backendUrl) {
      alert('Backend URL is not configured. Cannot perform action.');
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
          alert('Authentication failed. Please log in as an admin user to perform this action.');
          return;
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      };

      if (editingProduct) {
        // Update existing product
        await axios.put(`${backendUrl}/api/products/${editingProduct._id}`, formData, config);
      } else {
        // Create new product
        await axios.post(`${backendUrl}/api/products`, formData, config);
      }
      
      setIsFormVisible(false); // Hide form
      fetchProducts(); // Refresh the list
    } catch (err) {
      console.error('Failed to save product', err);
      alert('Failed to save product. Check console for details.');
    }
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
        <button 
          onClick={handleAddProduct}
          className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 transition duration-200"
        >
          Add New Product
        </button>
      </div>
      
      {isFormVisible && (
        <ProductForm 
          onSave={handleFormSubmit}
          onCancel={() => setIsFormVisible(false)}
          initialData={editingProduct}
        />
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {product.name}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    ₹{product.price}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {product.countInStock}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                    <button 
                      onClick={() => handleEditProduct(product)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// New component for the product form
const ProductForm = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    image: '',
    description: '',
    category: '',
    price: 0,
    countInStock: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'countInStock' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">{initialData ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-900 text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          {/* Image URL */}
          <div className="mb-4">
            <label className="block text-gray-900 text-sm font-bold mb-2">Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-900 text-sm font-bold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          {/* Category */}
          <div className="mb-4">
            <label className="block text-gray-900 text-sm font-bold mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          {/* Price */}
          <div className="mb-4">
            <label className="block text-gray-900 text-sm font-bold mb-2">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          {/* Count in Stock */}
          <div className="mb-6">
            <label className="block text-gray-900 text-sm font-bold mb-2">Count in Stock</label>
            <input
              type="number"
              name="countInStock"
              value={formData.countInStock}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageProducts;