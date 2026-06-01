import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const MetricCard = ({
    title,
    value
}) => (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
            {title}
        </p>

        <h2 className="mt-2 text-3xl font-bold">
            {value}
        </h2>
    </div>
);


const SystemDashboard = () => {

    const [metrics, setMetrics] =
    useState(null);

    const alerts = [];

        if (metrics?.lockedAccounts >= 3) {
            alerts.push(
                "Multiple locked accounts detected."
            );
        }

        if (metrics?.failedLoginsToday >= 10) {
            alerts.push(
                "High failed login activity today."
            );
        }

        if (metrics?.blockedLoginsToday >= 5) {
            alerts.push(
                "Multiple blocked login attempts detected."
            );
        }

        if (metrics?.forceLogoutsToday >= 3) {
            alerts.push(
                "Multiple force logout events detected."
            );
        }

const fetchMetrics = async () => {
    try {
        const response =
            await api.get(
                "/system/dashboard/metrics"
            );

        setMetrics(
            response.data
        );

    } catch (error) {
        console.error(
            "Failed to load metrics:",
            error
        );
    }
};

useEffect(() => {
    fetchMetrics();
}, []);


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
            
            <div className="mb-4">
                <h2 className="text-xl font-semibold">
                    Security Overview
                </h2>
            </div>

            <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                <MetricCard
                    title="Total Users"
                    value={metrics?.totalUsers || 0}
                />

                <MetricCard
                    title="Locked Accounts"
                    value={metrics?.lockedAccounts || 0}
                />

                <MetricCard
                    title="Failed Logins Today"
                    value={
                        metrics?.failedLoginsToday || 0
                    }
                />

                <MetricCard
                    title="Blocked Logins Today"
                    value={
                        metrics?.blockedLoginsToday || 0
                    }
                />

                <MetricCard
                    title="Audit Events Today"
                    value={
                        metrics?.auditEventsToday || 0
                    }
                />

                <MetricCard
                    title="Force Logouts Today"
                    value={
                        metrics?.forceLogoutsToday || 0
                    }
                />

            </div>

            <div className="mb-10">
    <h2 className="text-xl font-semibold mb-4">
        Security Alerts
    </h2>

    {alerts.length > 0 ? (
        <div className="space-y-3">
            {alerts.map(
                (alert, index) => (
                    <div
                        key={index}
                        className="rounded-lg border border-amber-300 bg-amber-50 p-4"
                    >
                        <p className="font-medium text-amber-800">
                            ⚠ {alert}
                        </p>
                    </div>
                )
            )}
        </div>
    ) : (
        <div className="rounded-lg border border-green-300 bg-green-50 p-4">
            <p className="font-medium text-green-700">
                ✓ No security alerts detected.
            </p>
        </div>
    )}
</div>

            <div className="mb-4">
                <h2 className="text-xl font-semibold">
                    Administration Tools
                </h2>
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
