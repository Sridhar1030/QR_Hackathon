import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, allowedRoles }) => {
    
    const accessToken =localStorage.getItem('accessToken');

    const userRole = localStorage.getItem('role');


    const roles = allowedRoles || ['user', 'admin'];

    if (roles.includes(userRole)) {
        if (userRole === 'admin') {
            return Component;
        } else if (userRole === 'user' && accessToken) {
            return Component;
        }
    }

    return <Navigate to="/" />;
};

export default ProtectedRoute;
