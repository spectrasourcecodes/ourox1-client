// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SimpleFooter from './components/SimpleFooter';
import InstallPrompt from './components/InstallPrompt';

// User Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Invest from './pages/Invest';
import Withdraw from './pages/Withdraw';
import KYC from './pages/KYC';
import Profile from './pages/Profile';
import Market from './pages/Market';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProfile from './pages/admin/AdminProfile';
import KycReceipts from './pages/admin/KycReceipts';

// maintenance page
import Maintenance from "./pages/Maintenance";
// set maintenance
const maintenanceMode = false;

// Protected Route Components
const ProtectedRoute = ({ children, isAllowed, redirectTo }) => {
  return isAllowed ? children : <Navigate to={redirectTo} />;
};

const AdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  return adminToken ? children : <Navigate to="/admin/login" />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [kycStatus, setKycStatus] = useState('pending');
  const location = useLocation();

  // Check authentication status on mount and route change
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [location]);

  // Determine if current route is admin route
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Determine which footer to show based on route
  const showFullFooter = location.pathname === '/' && !isAdminRoute;
  const showSimpleFooter = !['/', '/login', '/register', '/admin/login'].includes(location.pathname) && !isAdminRoute;
  const showNoFooter = ['/login', '/register', '/admin/login'].includes(location.pathname) || isAdminRoute;

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Only show Navbar for non-admin routes */}
        {!isAdminRoute && <Navbar isAuthenticated={isAuthenticated} />}
        
    
        <main className="flex-grow pt-16 md:pt-0">

          {maintenanceMode ? (

            <Routes>
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="*" element={<Navigate to="/maintenance" replace />} />
            </Routes>

          ) : (

            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/market" element={<Market />} />

              {/* Protected User Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute isAllowed={isAuthenticated} redirectTo="/login">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/invest"
                element={
                  <ProtectedRoute isAllowed={isAuthenticated} redirectTo="/login">
                    <Invest />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/withdraw"
                element={
                  <ProtectedRoute isAllowed={isAuthenticated} redirectTo="/login">
                    <Withdraw kycStatus={kycStatus} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/kyc"
                element={
                  <ProtectedRoute isAllowed={isAuthenticated} redirectTo="/login">
                    <KYC
                      kycStatus={kycStatus}
                      setKycStatus={setKycStatus}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute isAllowed={isAuthenticated} redirectTo="/login">
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />

              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/profile"
                element={
                  <AdminRoute>
                    <AdminProfile />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/kyc-receipts"
                element={
                  <AdminRoute>
                    <KycReceipts />
                  </AdminRoute>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>

          )}

        </main>
        
        {/* Conditional Footer Rendering - only for non-admin routes */}
        {!isAdminRoute && showFullFooter && <Footer />}
        {!isAdminRoute && showSimpleFooter && <SimpleFooter />}
        
        <InstallPrompt />
        <ToastContainer 
          position="top-center" 
          autoClose={4000}
          toastClassName="rounded-xl"
        />
      </div>
    </>
  );
}

export default App;