import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

const SystemDashboard = () => {
    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    System Admin
                </h1>

                <p className="text-gray-500">
                    Manage platform access and security controls.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Link
                    to="/system/users"
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow"
                >
                    <h2 className="text-xl font-semibold text-slate-950">
                        System Users
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Update user roles and account security status.
                    </p>
                </Link>

                <Link
                    to="/system/permissions"
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow"
                >
                    <h2 className="text-xl font-semibold text-slate-950">
                        Permission Matrix
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Configure role-based access permissions.
                    </p>
                </Link>
            </div>
        </DashboardLayout>
    );
};

export default SystemDashboard;
