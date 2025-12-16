import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// Simple component for public routes (login, register)
const PublicRoute = ({ children }) => {
    const { user, token } = useSelector((state) => state.auth);

    // If user is already logged in, redirect to their dashboard
    if (token && user) {
        if (user.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        } else if (user.role === 'driver') {
            return <Navigate to="/driver/dashboard" replace />;
        }
    }

    // If not logged in, show the page (login/register)
    return children;
};

export default PublicRoute;