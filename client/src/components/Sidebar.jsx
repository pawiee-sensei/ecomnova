import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";

const Sidebar = () => {
    const user = useAuthStore((state) => state.user);

    const menu = {
        admin:[
            { name: "Dashboard", path: "/admin/dashboard" },
            { name: "Agents", path: "/admin/employees" },
            { name: "Managers", path: "/admin/tickets" },
            { name: "Clients", path: "/admin/reports" },
        ],
        manager: [
            { name: "Dashboard", path: "/manager/dashboard" },
            { name: "Agents", path: "/manager/teams" },
        ],
        agent: [
            { name: "Dashboard", path: "/agent/dashboard" },
            { name: "Clients", path: "/agent/tickets" },
        ]
    };

    const links = menu[user?.role] || [];

    return (
        <aside className="w-64 h-screen border-r p-5">
            <h2 className="text-xl font-bold mb-6">EcomNova</h2>

            <nav className = "flex flex-col gap-3">
                {links.map((item) => (
                    <Link key={item.path} to={item.path}>
                        {item.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
