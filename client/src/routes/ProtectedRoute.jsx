import { Navigate } from "react-router-dom";

import useAuthStore from "../store/authStore";

const ProtectedRoute = ({
    children,
    roles
}) => {

    const { user, token, loading } = useAuthStore();

    if (loading) {
        return <div>Loading...</div>;
    }
    
    //if user is not logged in / redirect to login
    if (!token) {
        return <Navigate to="/login" />;
    }

    //checks if user has the required role
    if (
        roles &&
        !roles.includes(user?.role)
    ) {
        return <Navigate to="/login" />;
    }

    //if user has the required role, render the protected route
    return children;
};

export default ProtectedRoute;