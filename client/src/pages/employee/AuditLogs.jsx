import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    /*
      Fetch audit history
    */
    useEffect(() => {
        const fetchAuditLogs = async () => {
            try {
                const response = await api.get(
                    "/admin/employees/audit-logs"
                );

                setLogs(response.data);

            } catch (error) {
                console.error(
                    "Audit fetch failed:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAuditLogs();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <h1>Loading audit logs...</h1>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Audit Logs
                </h1>

                <p className="text-gray-500">
                    Administrative activity history
                </p>
            </div>

            <div className="border rounded-xl overflow-hidden">
                <table className="w-full">

                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-4">
                                Admin
                            </th>

                            <th className="text-left p-4">
                                Action
                            </th>

                            <th className="text-left p-4">
                                Target Employee
                            </th>

                            <th className="text-left p-4">
                                Details
                            </th>

                            <th className="text-left p-4">
                                Date
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {logs.map((log) => (
                            <tr
                                key={log.id}
                                className="border-t"
                            >
                                <td className="p-4">
                                    {log.actor_name}
                                </td>

                                <td className="p-4">
                                    {log.action}
                                </td>

                                <td className="p-4">
                                    {log.target_name}
                                </td>

                                <td className="p-4">
                                    {log.details}
                                </td>

                                <td className="p-4">
                                    {new Date(
                                        log.created_at
                                    ).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </DashboardLayout>
    );
};

export default AuditLogs;
