import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SystemStatus from './pages/SystemStatus';
import ManageProducts from './pages/ManageProducts';
import ManageOrders from './pages/ManageOrders';
// SalesReport is removed
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

function App() {
  const isAuthenticated = localStorage.getItem('userToken');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route path="/*" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />} />
        
        {/* Redirect from root to /status if authenticated */}
        <Route path="/" element={<Navigate to="/status" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// A new component to handle the main layout structure
const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden"> 
        <Navbar />
        {/* Main content area. On mobile, the sidebar is hidden, so we don't need margin. 
            On desktop (lg:), we add ml-64 to offset the fixed sidebar. */}
        <main className="p-4 lg:ml-64 transition-all duration-300">
          <Routes>
            <Route path="/status" element={<SystemStatus />} />
            <Route path="/products" element={<ManageProducts />} />
            <Route path="/orders" element={<ManageOrders />} />
            {/* Removed the path="/sales-report" route */}
            
            {/* Catch-all for unknown routes now redirects to /status */}
            <Route path="*" element={<Navigate to="/status" replace />} /> 
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;