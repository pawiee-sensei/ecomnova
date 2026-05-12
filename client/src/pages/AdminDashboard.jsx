import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

const AdminDashboard = () => {
    /*
      Dashboard stats state
      Stores API response
    */
    const [stats, setStats] = useState({
        totalEmployees: 0,
        activeEmployees: 0,
        totalDepartments: 0,
        openTickets: 0,
        escalatedTickets: 0,
        resolvedToday: 0
    });

    /*
      Loading state
      Prevent empty UI flash
    */
    const [loading, setLoading] = useState(true);

    /*
      Fetch admin dashboard metrics
    */
    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const response = await api.get(
                    "/admin/dashboard"
                );

                setStats(response.data);

            } catch (error) {
                console.error(
                    "Dashboard fetch failed:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    /*
      Loading fallback
    */
    if (loading) {
        return (
            <DashboardLayout>
                <h1>Loading dashboard...</h1>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Admin Dashboard
                </h1>

                <p className="text-gray-500">
                    Operations overview
                </p>
            </div>

            <div className="grid grid-cols-3 gap-6">

                {/* Total Employees */}
                <div className="border rounded-xl p-6 shadow-sm">
                    <h3 className="text-gray-500">
                        Total Employees
                    </h3>

                    <p className="text-3xl font-bold mt-2">
                        {stats.totalEmployees}
                    </p>
                </div>

                {/* Active Employees */}
                <div className="border rounded-xl p-6 shadow-sm">
                    <h3 className="text-gray-500">
                        Active Employees
                    </h3>

                    <p className="text-3xl font-bold mt-2">
                        {stats.activeEmployees}
                    </p>
                </div>

                {/* Departments */}
                <div className="border rounded-xl p-6 shadow-sm">
                    <h3 className="text-gray-500">
                        Departments
                    </h3>

                    <p className="text-3xl font-bold mt-2">
                        {stats.totalDepartments}
                    </p>
                </div>

                {/* Open Tickets */}
                <div className="border rounded-xl p-6 shadow-sm">
                    <h3 className="text-gray-500">
                        Open Tickets
                    </h3>

                    <p className="text-3xl font-bold mt-2">
                        {stats.openTickets}
                    </p>
                </div>

                {/* Escalated */}
                <div className="border rounded-xl p-6 shadow-sm">
                    <h3 className="text-gray-500">
                        Escalated Tickets
                    </h3>

                    <p className="text-3xl font-bold mt-2">
                        {stats.escalatedTickets}
                    </p>
                </div>

                {/* Resolved Today */}
                <div className="border rounded-xl p-6 shadow-sm">
                    <h3 className="text-gray-500">
                        Resolved Today
                    </h3>

                    <p className="text-3xl font-bold mt-2">
                        {stats.resolvedToday}
                    </p>
                </div>

            </div>

        </DashboardLayout>
    );
};

export default AdminDashboard;