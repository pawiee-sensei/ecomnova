import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

const Sidebar = () => {
    const user = useAuthStore((state) => state.user);
    const location = useLocation();

    /*
      Portal navigation config.
      HR owns people and org structure. System Admin owns access and security.
    */
    const systemAdminLinks = [
        {
            name: "System Dashboard",
            path: "/system/dashboard",
            icon: "D"
        },
        {
            name: "System Users",
            path: "/system/users",
            icon: "U"
        },
        {
            name: "Audit Logs",
            path: "/system/audit-logs",
            icon: "L"
        },
        {
            name: "Permissions",
            path: "/system/permissions",
            icon: "P"
        },
        {
            name: "Login Monitoring",
            path: "/system/login-monitoring",
            icon: "M"
        },
        {
            name: "Security Settings",
            path: "/system/security-settings",
            icon: "S"
        }
    ];

    const menu = {
        admin: systemAdminLinks,
        super_admin: systemAdminLinks,

        hr: [
            {
                name: "Dashboard",
                path: "/hr/dashboard",
                icon: "D"
            },
            {
                name: "Employees",
                path: "/hr/employees",
                icon: "E"
            },
            {
                name: "Departments",
                path: "/hr/departments",
                icon: "P"
            },
            {
                name: "Teams",
                path: "/hr/teams",
                icon: "T"
            }
        ],

        manager: [
            {
                name: "Dashboard",
                path: "/manager/dashboard",
                icon: "D"
            },
            {
                name: "My Team",
                path: "/manager/team",
                icon: "T"
            },
            {
                name: "Announcements",
                path: "/manager/announcements",
                icon: "A"
            },
            {
                name: "Attendance",
                path: "/manager/attendance",
                icon: "A"
            },
            {
                name: "Performance",
                path: "/manager/performance",
                icon: "P"
            },
            {
                name: "Leave",
                path: "/manager/leave",
                icon: "L"
            },
            {
                name: "KPI",
                path: "/manager/kpi",
                icon: "K"
            },
            {
                name: "Shifts",
                path: "/manager/shifts",
                icon: "S"
            },
            {
                name: "Reports",
                path: "/manager/reports",
                icon: "R"
            }
        ],

        agent: [
            {
                name: "Dashboard",
                path: "/agent/dashboard",
                icon: "D"
            },
            {
                name: "Attendance",
                path: "/agent/attendance",
                icon: "A"
            },
            {
                name: "Leave",
                path: "/agent/leave",
                icon: "L"
            },
            {
                name: "Tickets",
                path: "/agent/tickets",
                icon: "T"
            },
            {
                name: "Performance",
                path: "/agent/performance",
                icon: "P"
            }
        ],
    };

    const links = menu[user?.role] || [];

    return (
        <aside className="min-h-screen w-64 shrink-0 border-r border-slate-200 bg-white p-5">

            {/* Branding */}
            <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-base font-bold text-white">
                        EN
                    </div>

                    <div>
                        <h1 className="text-xl font-bold text-slate-950">
                            EcomNova
                        </h1>

                        <p className="text-sm text-slate-500">
                            Workforce Console
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1">
                {links.map((item) => {
                    const isActive =
                        location.pathname === item.path ||
                        location.pathname.startsWith(
                            `${item.path}/`
                        );

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                                flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition
                                ${
                                    isActive
                                        ? "bg-slate-950 text-white shadow-sm"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                                }
                            `}
                        >
                            <span
                                className={`
                                    flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold
                                    ${
                                        isActive
                                            ? "bg-white text-slate-950"
                                            : "bg-slate-100 text-slate-500"
                                    }
                                `}
                            >
                                {item.icon}
                            </span>

                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-950">
                    Signed in as
                </p>

                <p className="mt-1 truncate text-sm text-slate-500">
                    {user?.fullname || "User"}
                </p>
            </div>

        </aside>
    );
};

export default Sidebar;
