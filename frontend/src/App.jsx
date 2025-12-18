import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Auth/register';
import Login from './pages/Auth/login';
import DriverDashboard from './pages/Driver/dashboard';
import MyTrips from './pages/Driver/MyTrips';
import TripDetails from './pages/Driver/TripDetails';
import AdminDashboard from './pages/Admin/Dashboard';
import TruckManagement from './pages/Admin/TruckManagement';
import TrailerManagement from './pages/Admin/TrailerManagement';
import TripManagement from './pages/Admin/TripManagement';
import TireManagement from './pages/Admin/TireManagement';
import Reports from './pages/Admin/Reports';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import DriverManagement from './pages/Admin/DriverManagement';
import MaintenanceManagement from './pages/Admin/MaintenanceManagement';

function App() {
  return (
    <Routes>
      {/* Public routes - only for non-logged-in users */}
      <Route path="/" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      
      {/* Driver nested routes - only for drivers */}
      <Route path="/driver" element={
        <ProtectedRoute allowedRoles={['driver']}>
          <Navigate to="/driver/dashboard" replace />
        </ProtectedRoute>
      } />
      <Route path="/driver/*" element={
        <ProtectedRoute allowedRoles={['driver']}>
          <Routes>
            <Route path="dashboard" element={<DriverDashboard />} />
            <Route path="trips" element={<MyTrips />} />
            <Route path="trips/:id" element={<TripDetails />} />
          </Routes>
        </ProtectedRoute>
      } />
      
      {/* Admin nested routes - only for admins */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Navigate to="/admin/dashboard" replace />
        </ProtectedRoute>
      } />
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Routes>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="trucks" element={<TruckManagement />} />
            <Route path="trailers" element={<TrailerManagement />} />
            <Route path="trips" element={<TripManagement />} />
            <Route path="tires" element={<TireManagement />} />
            <Route path="maintenance" element={<MaintenanceManagement />} />
            <Route path="reports" element={<Reports />} />
            <Route path="users" element={<DriverManagement />} />
          </Routes>
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App
