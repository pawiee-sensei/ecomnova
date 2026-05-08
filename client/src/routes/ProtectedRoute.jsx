import { Navigate } from "react-router-dom";

import useAuthStore from "../store/authStore";

const ProtectedRoute = ({
    children,
    roles
}) => {

    const user = useAuthStore(
        (state) => state.user
    );

    const token = useAuthStore(
        (state) => state.token
    );

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (
        roles &&
        !roles.includes(user?.role)
    ) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;