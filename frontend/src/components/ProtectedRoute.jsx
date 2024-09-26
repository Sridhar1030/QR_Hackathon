import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, allowedRoles }) => {
    
    const data = JSON.parse(localStorage.getItem('data'));

    const accessToken = data?.accessToken; 
    const userRole = data?.role;


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
