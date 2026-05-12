import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const LogoutButton = () => {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default LogoutButton;
