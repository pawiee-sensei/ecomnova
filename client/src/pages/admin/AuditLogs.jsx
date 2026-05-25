import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const AuditLogs = () => {
    const [logs, setLogs] =
        useState([]);

    const fetchLogs = async () => {
        try {
            const response =
                await api.get(
                    "/system/audit-logs"
                );

            setLogs(
                response.data
            );

        } catch (error) {
            console.error(
                "Audit log fetch failed:",
                error
            );
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Audit Logs
                </h1>

                <p className="text-gray-500">
                    Security and governance activity
                </p>
            </div>

            <div className="border rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-4">
                                Timestamp
                            </th>

                            <th className="text-left p-4">
                                Actor
                            </th>

                            <th className="text-left p-4">
                                Action
                            </th>

                            <th className="text-left p-4">
                                Module
                            </th>

                            <th className="text-left p-4">
                                Target
                            </th>

                            <th className="text-left p-4">
                                Details
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
                                    {new Date(
                                        log.created_at
                                    ).toLocaleString()}
                                </td>

                                <td className="p-4">
                                    {log.actor_name ||
                                        "System"}
                                </td>

                                <td className="p-4 capitalize">
                                    {log.action
                                        .replaceAll(
                                            "_",
                                            " "
                                        )}
                                </td>

                                <td className="p-4 capitalize">
                                    {log.module
                                        .replaceAll(
                                            "_",
                                            " "
                                        )}
                                </td>

                                <td className="p-4">
                                    {log.target_name ||
                                        "—"}
                                </td>

                                <td className="p-4">
                                    {log.details}
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