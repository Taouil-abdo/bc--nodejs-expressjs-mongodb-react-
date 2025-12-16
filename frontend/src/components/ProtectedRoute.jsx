import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// Simple component to protect routes
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, token } = useSelector((state) => state.auth);

    // Check if user is logged in
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has the right role
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // If user is driver but trying to access admin, redirect to driver dashboard
        if (user.role === 'driver') {
            return <Navigate to="/driver/dashboard" replace />;
        }
        // If user is admin but trying to access driver, redirect to admin dashboard
        if (user.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        }
        // Default redirect to login
        return <Navigate to="/login" replace />;
    }

    // If everything is ok, show the page
    return children;
};

export default ProtectedRoute;