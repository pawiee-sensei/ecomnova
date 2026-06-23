import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-US", {
        month: "short", day: "numeric", year: "numeric",
    }).format(date);
};

const statusStyles = {
    open: "bg-blue-50 text-blue-700 ring-blue-200",
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    escalated: "bg-rose-50 text-rose-700 ring-rose-200",
    resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    closed: "bg-slate-100 text-slate-500 ring-slate-200",
};

const priorityStyles = {
    low: "bg-slate-50 text-slate-600 ring-slate-200",
    medium: "bg-blue-50 text-blue-600 ring-blue-200",
    high: "bg-amber-50 text-amber-700 ring-amber-200",
    urgent: "bg-rose-50 text-rose-700 ring-rose-200",
};

const statusAccent = {
    open: "border-l-blue-500",
    pending: "border-l-amber-500",
    escalated: "border-l-rose-500",
    resolved: "border-l-emerald-500",
    closed: "border-l-slate-300",
};

const AGENT_STATUSES = ["open", "pending", "resolved", "closed"];

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const response = await api.get("/agent/tickets");
            setSummary(response.data.summary);
            setTickets(response.data.tickets);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleUpdateStatus = async (ticketId, status) => {
        try {
            setActionLoading(true);
            await api.put(`/agent/tickets/${ticketId}/status`, { status });
            setUpdatingStatus(null);
            if (selectedTicket?.id === ticketId) {
                setSelectedTicket((prev) => ({ ...prev, status }));
            }
            fetchTickets();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const filtered = statusFilter === "all"
        ? tickets
        : tickets.filter((t) => t.status === statusFilter);

    const totalActive = (summary?.open || 0) + (summary?.pending || 0) + (summary?.escalated || 0);

    return (
        <DashboardLayout>

            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Agent Portal
                    </p>
                    <h1 className="text-3xl font-bold text-slate-800">
                        My Tickets
                    </h1>
                    <p className="mt-1 text-slate-500">
                        View and manage your assigned tickets.
                    </p>
                </div>
                {totalActive > 0 && (
                    <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600">
                        {totalActive} active
                    </span>
                )}
            </div>

            {/* Summary Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {[
                    { label: "Open", value: summary?.open || 0, accent: "border-l-blue-500" },
                    { label: "Pending", value: summary?.pending || 0, accent: "border-l-amber-500" },
                    { label: "Escalated", value: summary?.escalated || 0, accent: "border-l-rose-500" },
                    { label: "Resolved", value: summary?.resolved || 0, accent: "border-l-emerald-500" },
                    { label: "Closed", value: summary?.closed || 0, accent: "border-l-slate-300" },
                ].map((card) => (
                    <div key={card.label} className={`rounded-xl border border-slate-100 border-l-4 bg-white p-5 shadow-sm ${card.accent}`}>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{card.label}</p>
                        <p className="mt-2 text-4xl font-bold text-slate-800">{card.value}</p>
                        <p className="mt-1 text-xs text-slate-400">tickets</p>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div className="mb-4 flex flex-wrap gap-2">
                {["all", "open", "pending", "escalated", "resolved", "closed"].map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-all ${
                            statusFilter === s
                                ? "bg-slate-900 text-white"
                                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                    >
                        {s === "all" ? "All Tickets" : s}
                    </button>
                ))}
            </div>

            {/* Tickets Table */}
            <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
                {loading ? (
                    <div className="flex h-40 items-center justify-center">
                        <p className="text-sm text-slate-400">Loading tickets...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center text-center">
                        <p className="text-sm font-medium text-slate-600">No tickets found</p>
                        <p className="mt-1 text-xs text-slate-400">
                            {statusFilter === "all"
                                ? "No tickets have been assigned to you yet."
                                : `No ${statusFilter} tickets.`}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="px-5 py-3 text-left font-semibold">Title</th>
                                    <th className="px-5 py-3 text-left font-semibold">Priority</th>
                                    <th className="px-5 py-3 text-left font-semibold">Status</th>
                                    <th className="px-5 py-3 text-left font-semibold">Department</th>
                                    <th className="px-5 py-3 text-left font-semibold">Created</th>
                                    <th className="px-5 py-3 text-left font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-slate-50">
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-slate-800">{ticket.title}</p>
                                            <p className="mt-0.5 text-xs text-slate-400 line-clamp-1">
                                                {ticket.description || "No description"}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${priorityStyles[ticket.priority]}`}>
                                                {ticket.priority}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${statusStyles[ticket.status]}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-slate-600">
                                            {ticket.department_name || "—"}
                                        </td>
                                        <td className="px-5 py-4 text-xs text-slate-400">
                                            {formatDate(ticket.created_at)}
                                        </td>
                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() => {
                                                    setSelectedTicket(ticket);
                                                    setUpdatingStatus(null);
                                                }}
                                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* View Ticket Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

                        {/* Modal Header */}
                        <div className={`border-l-4 bg-slate-900 px-6 py-5 text-white ${statusAccent[selectedTicket.status]}`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                                        Ticket #{selectedTicket.id}
                                    </p>
                                    <h2 className="mt-1 text-lg font-bold">
                                        {selectedTicket.title}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedTicket(null);
                                        setUpdatingStatus(null);
                                    }}
                                    className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="space-y-4 p-6">

                            {/* Details */}
                            <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
                                {[
                                    {
                                        label: "Status",
                                        value: (
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${statusStyles[selectedTicket.status]}`}>
                                                {selectedTicket.status}
                                            </span>
                                        )
                                    },
                                    {
                                        label: "Priority",
                                        value: (
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${priorityStyles[selectedTicket.priority]}`}>
                                                {selectedTicket.priority}
                                            </span>
                                        )
                                    },
                                    { label: "Department", value: selectedTicket.department_name || "—" },
                                    { label: "Created", value: formatDate(selectedTicket.created_at) },
                                    { label: "Last Updated", value: formatDate(selectedTicket.updated_at) },
                                    { label: "Resolved", value: formatDate(selectedTicket.resolved_at) },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between px-4 py-3">
                                        <span className="text-sm text-slate-500">{item.label}</span>
                                        <span className="text-sm font-medium text-slate-800">{item.value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Description */}
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Description</p>
                                <p className="mt-1 text-sm text-slate-700">
                                    {selectedTicket.description || "No description provided."}
                                </p>
                            </div>

                            {/* Update Status */}
                            {selectedTicket.status !== "closed" && selectedTicket.status !== "escalated" && (
                                <div>
                                    {updatingStatus === selectedTicket.id ? (
                                        <div className="space-y-3">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                Update Status
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {AGENT_STATUSES.filter((s) => s !== selectedTicket.status).map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => handleUpdateStatus(selectedTicket.id, s)}
                                                        disabled={actionLoading}
                                                        className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize ring-1 transition-all disabled:opacity-50 ${statusStyles[s]}`}
                                                    >
                                                        {actionLoading ? "..." : `Mark as ${s}`}
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => setUpdatingStatus(null)}
                                                className="text-xs text-slate-400 hover:text-slate-600"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setUpdatingStatus(selectedTicket.id)}
                                            className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
                                        >
                                            Update Status
                                        </button>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}

        </DashboardLayout>
    );
};

export default MyTickets;