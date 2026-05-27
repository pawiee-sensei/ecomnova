import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const LoginMonitoring = () => {
    const [attempts, setAttempts] =
        useState([]);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("");

    const fetchAttempts = async () => {
        try {
            const response =
                await api.get(
                    "/system/login-monitoring"
                );

            setAttempts(
                response.data
            );

        } catch (error) {
            console.error(
                "Login monitoring fetch failed:",
                error
            );
        }
    };

    useEffect(() => {
        fetchAttempts();
    }, []);

    const filteredAttempts =
        attempts.filter((attempt) => {
            const matchesSearch =
                attempt.email
                    ?.toLowerCase()
                    .includes(
                        searchTerm.toLowerCase()
                    ) ||
                attempt.fullname
                    ?.toLowerCase()
                    .includes(
                        searchTerm.toLowerCase()
                    );

            const matchesStatus =
                !statusFilter ||
                attempt.status ===
                    statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        });

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Login Monitoring
                </h1>

                <p className="text-gray-500">
                    Authentication activity monitoring
                </p>

                <div className="mt-6 flex gap-4 flex-wrap">
                    <input
                        type="text"
                        placeholder="Search email..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(
                                e.target.value
                            )
                        }
                        className="border p-3 rounded-lg w-72"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                        className="border p-3 rounded-lg"
                    >
                        <option value="">
                            All Status
                        </option>

                        <option value="SUCCESS">
                            Success
                        </option>

                        <option value="FAILED">
                            Failed
                        </option>

                        <option value="BLOCKED">
                            Blocked
                        </option>
                    </select>
                </div>
            </div>

            <div className="border rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-4">
                                Timestamp
                            </th>

                            <th className="text-left p-4">
                                User
                            </th>

                            <th className="text-left p-4">
                                Email
                            </th>

                            <th className="text-left p-4">
                                Status
                            </th>

                            <th className="text-left p-4">
                                Reason
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredAttempts.map(
                            (attempt) => (
                                <tr
                                    key={
                                        attempt.id
                                    }
                                    className="border-t"
                                >
                                    <td className="p-4">
                                        {new Date(
                                            attempt.created_at
                                        ).toLocaleString()}
                                    </td>

                                    <td className="p-4">
                                        {attempt.fullname ||
                                            "Unknown"}
                                    </td>

                                    <td className="p-4">
                                        {
                                            attempt.email
                                        }
                                    </td>

                                    <td className="p-4">
                                        {
                                            attempt.status
                                        }
                                    </td>

                                    <td className="p-4">
                                        {
                                            attempt.reason
                                        }
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default LoginMonitoring;