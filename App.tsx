import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserRole } from './types';

// Layout and Public Pages
import Layout from './components/Layout';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import CompaniesListPage from './pages/CompaniesListPage';
import PublicCompanyPage from './pages/PublicCompanyPage';
import CustomerBookingPage from './pages/CustomerBookingPage';
import SellerPublicPage from './pages/SellerPublicPage';
import CustomerBookingSearchPage from './pages/CustomerBookingSearchPage';


// Master Dashboard Pages
import MasterDashboard from './pages/master/MasterDashboard';
import ManageCompanies from './pages/master/ManageCompanies';
import ManageSellers from './pages/master/ManageSellers';
import TransactionReports from './pages/master/TransactionReports';
import Settings from './pages/master/Settings';
import ManageHomepage from './pages/master/ManageHomepage';

// Company Dashboard Pages
import CompanyDashboard from './pages/company/CompanyDashboard';
import ManageTours from './pages/company/ManageTours';
import ManageBookings from './pages/company/ManageBookings';
import SellerReports from './pages/company/SellerReports';

// Seller Dashboard Pages
import SellerDashboard from './pages/seller/SellerDashboard';
import MyLinksPage from './pages/seller/MyLinksPage';
import MySalesPage from './pages/seller/MySalesPage';

const ProtectedRoute: React.FC<{ allowedRoles?: UserRole[] }> = ({ allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />; // or a specific "unauthorized" page
  }

  return <Layout><Outlet /></Layout>;
};

const DashboardRedirect: React.FC = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;

    switch (user.role) {
        case UserRole.MASTER:
            return <MasterDashboard />;
        case UserRole.COMPANY:
            return <CompanyDashboard />;
        case UserRole.SELLER:
            return <SellerDashboard />;
        default:
            return <Navigate to="/login" replace />;
    }
};

const App: React.FC = () => {
  return (
    <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/companies" element={<CompaniesListPage />} />
            <Route path="/company/:slug" element={<PublicCompanyPage />} />
            <Route path="/book/:tourId" element={<CustomerBookingPage />} />
            <Route path="/seller/:sellerId" element={<SellerPublicPage />} />
            <Route path="/manage-booking" element={<CustomerBookingSearchPage />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute />}>
              <Route index element={<DashboardRedirect />} />
              
              {/* Master Routes */}
              <Route path="companies" element={<ManageCompanies />} />
              <Route path="sellers" element={<ManageSellers />} />
              <Route path="reports" element={<TransactionReports />} />
              <Route path="homepage" element={<ManageHomepage />} />
              <Route path="settings" element={<Settings />} />

              {/* Company Routes */}
              <Route path="tours" element={<ManageTours />} />
              <Route path="bookings" element={<ManageBookings />} />
              <Route path="seller-reports" element={<SellerReports />} />
              
              {/* Seller Routes */}
              <Route path="my-links" element={<MyLinksPage />} />
              <Route path="my-sales" element={<MySalesPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
    </AuthProvider>
  );
};

export default App;