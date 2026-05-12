import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

const Sidebar = () => {
    const user = useAuthStore((state) => state.user);
    const location = useLocation();

    /*
      Role-based navigation config
    */
    const menu = {
        admin: [
            {
                name: "Dashboard",
                path: "/admin/dashboard"
            },
            {
                name: "Employees",
                path: "/admin/employees"
            },
            {
                name: "Departments",
                path: "/admin/departments"
            },
            {
                name: "Teams",
                path: "/admin/teams"
            },
            {
                name: "Tickets",
                path: "/admin/tickets"
            },
            {
                name: "Analytics",
                path: "/admin/analytics"
            },
            {
                name: "Reports",
                path: "/admin/reports"
            },
            {
                name: "Audit Logs",
                path: "/admin/audit-logs"
            },
            {
                name: "Settings",
                path: "/admin/settings"
            }
        ],

        manager: [
            {
                name: "Dashboard",
                path: "/manager/dashboard"
            }
        ],

        agent: [
            {
                name: "Dashboard",
                path: "/agent/dashboard"
            }
        ]
    };

    const links = menu[user?.role] || [];

    return (
        <aside className="w-64 min-h-screen border-r bg-white p-6">

            {/* Branding */}
            <div className="mb-10">
                <h1 className="text-2xl font-bold">
                    EcomNova
                </h1>

                <p className="text-sm text-gray-500">
                    Admin Portal
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2">
                {links.map((item) => {
                    const isActive =
                        location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                                px-4 py-3 rounded-lg transition
                                ${
                                    isActive
                                        ? "bg-black text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                }
                            `}
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

        </aside>
    );
};

export default Sidebar;