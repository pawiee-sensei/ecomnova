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
        <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
            Logout
        </button>
    );
};

export default LogoutButton;
