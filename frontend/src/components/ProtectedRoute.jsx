import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// Simple component to protect routes
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, token } = useSelector((state) => state.auth);

    console.log('Redux State:', { user, token }); 

    // Check if user is logged in
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has the right role
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        if (user.role === 'driver') {
            return <Navigate to="/driver/dashboard" replace />;
        }
        if (user.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    // If everything is ok, show the page
    return children;
};

export default ProtectedRoute;