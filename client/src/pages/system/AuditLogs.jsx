import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const AuditLogs = () => {
    const [logs, setLogs] =
        useState([]);

const [searchTerm, setSearchTerm] =
    useState("");

const [actionFilter, setActionFilter] =
    useState("");

const [moduleFilter, setModuleFilter] =
    useState("");

    const [dateFilter, setDateFilter] =
    useState("all");

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

    const actions = [
    ...new Set(
        logs
            .map((log) => log.action)
            .filter(Boolean)
    )
];

    const modules = [
    ...new Set(
        logs
            .map((log) => log.module)
            .filter(Boolean)
    )
];

    const filteredLogs = logs.filter(
    (log) => {
        const matchesSearch =
            log.actor_name
                ?.toLowerCase()
                .includes(
                    searchTerm.toLowerCase()
                ) ||
            log.target_name
                ?.toLowerCase()
                .includes(
                    searchTerm.toLowerCase()
                ) ||
            log.action
                ?.toLowerCase()
                .includes(
                    searchTerm.toLowerCase()
                ) ||
            log.details
                ?.toLowerCase()
                .includes(
                    searchTerm.toLowerCase()
                );

        const matchesAction =
            !actionFilter ||
            (log.action || "")
                .toLowerCase() ===
                actionFilter.toLowerCase();

        const matchesModule =
            !moduleFilter ||
            (log.module || "")
                .toLowerCase() ===
                moduleFilter.toLowerCase();

        let matchesDate = true;

if (dateFilter === "today") {
    matchesDate =
        new Date(
            log.created_at
        ).toDateString() ===
        new Date().toDateString();
}

if (dateFilter === "7days") {
    const sevenDaysAgo =
        new Date();

    sevenDaysAgo.setDate(
        sevenDaysAgo.getDate() - 7
    );

    matchesDate =
        new Date(
            log.created_at
        ) >= sevenDaysAgo;
}

if (dateFilter === "30days") {
    const thirtyDaysAgo =
        new Date();

    thirtyDaysAgo.setDate(
        thirtyDaysAgo.getDate() - 30
    );

    matchesDate =
        new Date(
            log.created_at
        ) >= thirtyDaysAgo;
}

        return (
            matchesSearch &&
            matchesAction &&
            matchesModule &&
            matchesDate
        );
    }
);

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Audit Logs
                </h1>

                <p className="text-gray-500">
                    Security and governance activity
                </p>

                <p className="mt-2 text-sm text-slate-500">
                    Showing {filteredLogs.length} of {logs.length} audit events
                </p>
            </div>

            <div className="mt-6 flex gap-4 flex-wrap">

                <input
                    type="text"
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                    className="border p-3 rounded-lg w-72"
                />

<select
    value={actionFilter}
    onChange={(e) =>
        setActionFilter(
            e.target.value
        )
    }
    className="border p-3 rounded-lg"
>
    <option value="">
        All Actions
    </option>

    {actions.map((action) => (
        <option
            key={action}
            value={action}
        >
            {action.replaceAll(
                "_",
                " "
            )}
        </option>
    ))}
</select>

                <select
                    value={moduleFilter}
                    onChange={(e) =>
                        setModuleFilter(
                            e.target.value
                        )
                    }
                    className="border p-3 rounded-lg"
                >
                <option value="">
                    All Modules
                </option>

                {modules.map((module) => (
                    <option
                        key={module}
                        value={module}
                    >
                        {module.replaceAll(
                            "_",
                            " "
                        )}
                    </option>
            ))}
                    
                </select>

                <select
                    value={dateFilter}
                    onChange={(e) =>
                        setDateFilter(
                            e.target.value
                        )
                    }
                    className="border p-3 rounded-lg"
                >
                    <option value="all">
                        All Dates
                    </option>
                    <option value="today">
                        Today
                    </option>
                    <option value="7days">
                        Last 7 Days
                    </option>
                    <option value="30days">
                        Last 30 Days
                    </option>
                </select>

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

    {filteredLogs.length === 0 && (
        <tr>
            <td
                colSpan="6"
                className="p-8 text-center text-gray-500"
            >
                No audit logs found.
            </td>
        </tr>
    )}

{filteredLogs.map((log) => (
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