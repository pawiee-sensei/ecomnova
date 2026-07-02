import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const formatTime = (timestamp) => {
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit", minute: "2-digit", hour12: true,
    });
};

const liveStatusStyles = {
    "Working": "bg-emerald-50 text-emerald-700 ring-emerald-200",
    "Working (Late)": "bg-amber-50 text-amber-700 ring-amber-200",
    "Clocked Out": "bg-slate-100 text-slate-500 ring-slate-200",
    "On Leave": "bg-blue-50 text-blue-700 ring-blue-200",
    "Not Clocked In": "bg-rose-50 text-rose-700 ring-rose-200",
};

const liveStatusDot = {
    "Working": "bg-emerald-500",
    "Working (Late)": "bg-amber-400",
    "Clocked Out": "bg-slate-400",
    "On Leave": "bg-blue-400",
    "Not Clocked In": "bg-rose-500",
};

const OperationMonitor = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [filter, setFilter] = useState("all");

    const fetchData = async () => {
        try {
            const response = await api.get("/manager/operation-monitor");
            setData(response.data);
            setLastUpdated(new Date());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    const filtered = filter === "all"
        ? data?.agents || []
        : (data?.agents || []).filter((a) => {
            if (filter === "working") return a.liveStatus === "Working" || a.liveStatus === "Working (Late)";
            if (filter === "not-clocked-in") return a.liveStatus === "Not Clocked In";
            if (filter === "on-leave") return a.liveStatus === "On Leave";
            if (filter === "clocked-out") return a.liveStatus === "Clocked Out";
            return true;
        });

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric", year: "numeric",
    });

    return (
        <DashboardLayout>

            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Manager Dashboard
                    </p>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Operation Monitor
                    </h1>
                    <p className="mt-1 text-slate-500">{today}</p>
                </div>
                <div className="flex items-center gap-3">
                    {lastUpdated && (
                        <p className="text-xs text-slate-400">
                            Updated {lastUpdated.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                        </p>
                    )}
                    <button
                        onClick={fetchData}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                        ↻ Refresh
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <p className="text-sm text-slate-400">Loading operation data...</p>
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="mb-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
                        {[
                            { label: "Total", value: data?.summary?.total || 0, accent: "border-l-slate-400" },
                            { label: "Working", value: data?.summary?.present || 0, accent: "border-l-emerald-500" },
                            { label: "Late", value: data?.summary?.late || 0, accent: "border-l-amber-500" },
                            { label: "Not In", value: data?.summary?.notClockedIn || 0, accent: "border-l-rose-500" },
                            { label: "On Leave", value: data?.summary?.onLeave || 0, accent: "border-l-blue-500" },
                            { label: "Active Tickets", value: (data?.agents || []).reduce((sum, a) => sum + Number(a.active_tickets || 0), 0), accent: "border-l-violet-500" },
                        ].map((card) => (
                            <div key={card.label} className={`rounded-xl border border-slate-100 border-l-4 bg-white p-4 shadow-sm ${card.accent}`}>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{card.label}</p>
                                <p className="mt-2 text-3xl font-bold text-slate-800">{card.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Filter Tabs */}
                    <div className="mb-4 flex flex-wrap gap-2">
                        {[
                            { key: "all", label: "All" },
                            { key: "working", label: "Working" },
                            { key: "not-clocked-in", label: "Not Clocked In" },
                            { key: "on-leave", label: "On Leave" },
                            { key: "clocked-out", label: "Clocked Out" },
                        ].map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                                    filter === f.key
                                        ? "bg-slate-900 text-white"
                                        : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Agent Table */}
                    <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
                        {filtered.length === 0 ? (
                            <div className="flex h-40 items-center justify-center">
                                <p className="text-sm text-slate-400">No agents found.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                        <tr>
                                            <th className="px-5 py-3 text-left font-semibold">Agent</th>
                                            <th className="px-5 py-3 text-left font-semibold">Shift</th>
                                            <th className="px-5 py-3 text-left font-semibold">Clock In</th>
                                            <th className="px-5 py-3 text-left font-semibold">Clock Out</th>
                                            <th className="px-5 py-3 text-left font-semibold">Active Tickets</th>
                                            <th className="px-5 py-3 text-left font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filtered.map((agent) => (
                                            <tr key={agent.id} className="hover:bg-slate-50">
                                                <td className="px-5 py-4">
                                                    <p className="font-semibold text-slate-800">{agent.fullname}</p>
                                                    <p className="text-xs text-slate-400">{agent.job_title || "—"}</p>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-slate-600">
                                                    {agent.shift || "—"}
                                                </td>
                                                <td className="px-5 py-4 text-sm text-slate-600">
                                                    {formatTime(agent.time_in)}
                                                </td>
                                                <td className="px-5 py-4 text-sm text-slate-600">
                                                    {formatTime(agent.time_out)}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                                        Number(agent.active_tickets) > 0
                                                            ? "bg-violet-50 text-violet-700 ring-1 ring-violet-200"
                                                            : "bg-slate-50 text-slate-400 ring-1 ring-slate-200"
                                                    }`}>
                                                        {agent.active_tickets} ticket{Number(agent.active_tickets) !== 1 ? "s" : ""}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${liveStatusStyles[agent.liveStatus] || "bg-slate-100 text-slate-500 ring-slate-200"}`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${liveStatusDot[agent.liveStatus] || "bg-slate-400"}`} />
                                                        {agent.liveStatus}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Auto refresh note */}
                    <p className="mt-4 text-center text-xs text-slate-400">
                        Auto-refreshes every 60 seconds
                    </p>
                </>
            )}

        </DashboardLayout>
    );
};

export default OperationMonitor;