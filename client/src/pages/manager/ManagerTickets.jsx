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

const PRIORITIES = ["low", "medium", "high", "urgent"];
const STATUSES = ["open", "pending", "escalated", "resolved", "closed"];

const ManagerTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [summary, setSummary] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");
    const [agentId, setAgentId] = useState("");
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState("");

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const response = await api.get("/manager/tickets");
            setTickets(response.data.tickets);
            setSummary(response.data.summary);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeam = async () => {
        try {
            const response = await api.get("/manager/team");
            setEmployees(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTickets();
        fetchTeam();
    }, []);

    const handleCreateTicket = async () => {
        if (!title.trim() || !agentId) {
            setFormError("Title and agent are required.");
            return;
        }
        try {
            setFormLoading(true);
            setFormError("");
            const selectedAgent = employees.find((e) => String(e.id) === String(agentId));
            await api.post("/manager/tickets", {
                title,
                description,
                priority,
                agentId: Number(agentId),
                departmentId: selectedAgent?.department_id || null,
            });
            setTitle("");
            setDescription("");
            setPriority("medium");
            setAgentId("");
            setShowForm(false);
            setSuccessMessage("Ticket created and assigned successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
            fetchTickets();
        } catch (error) {
            setFormError(error.response?.data?.message || "Failed to create ticket.");
        } finally {
            setFormLoading(false);
        }
    };

    const handleUpdateStatus = async (ticketId, status) => {
        try {
            setActionLoading(true);
            await api.put(`/manager/tickets/${ticketId}/status`, { status });
            setSelectedTicket((prev) => prev ? { ...prev, status } : null);
            setSuccessMessage("Ticket status updated!");
            setTimeout(() => setSuccessMessage(""), 3000);
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

    return (
        <DashboardLayout>

            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Manager Dashboard
                    </p>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Tickets
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Create and manage tickets assigned to your team.
                    </p>
                </div>
                <button
                    onClick={() => { setShowForm(true); setFormError(""); }}
                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
                >
                    + Create Ticket
                </button>
            </div>

            {successMessage && (
                <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    ✓ {successMessage}
                </div>
            )}

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
                            {statusFilter === "all" ? "Create your first ticket using the button above." : `No ${statusFilter} tickets.`}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="px-5 py-3 text-left font-semibold">Title</th>
                                    <th className="px-5 py-3 text-left font-semibold">Assigned To</th>
                                    <th className="px-5 py-3 text-left font-semibold">Priority</th>
                                    <th className="px-5 py-3 text-left font-semibold">Status</th>
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
                                            <p className="text-sm font-medium text-slate-700">{ticket.agent_name}</p>
                                            <p className="text-xs text-slate-400">{ticket.agent_code}</p>
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
                                        <td className="px-5 py-4 text-xs text-slate-400">
                                            {formatDate(ticket.created_at)}
                                        </td>
                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() => setSelectedTicket(ticket)}
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

            {/* Create Ticket Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="bg-slate-900 px-6 py-5 text-white">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-lg font-bold">Create Ticket</h2>
                                    <p className="mt-0.5 text-sm text-slate-400">Assign a ticket to a team member.</p>
                                </div>
                                <button
                                    onClick={() => { setShowForm(false); setFormError(""); }}
                                    className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 p-6">
                            {formError && (
                                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                    {formError}
                                </div>
                            )}

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-500">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ticket title"
                                    className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-500">Description</label>
                                <textarea
                                    rows="3"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the ticket..."
                                    className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-500">Priority</label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none"
                                    >
                                        {PRIORITIES.map((p) => (
                                            <option key={p} value={p} className="capitalize">{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-500">Assign To</label>
                                    <select
                                        value={agentId}
                                        onChange={(e) => setAgentId(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none"
                                    >
                                        <option value="">Select agent</option>
                                        {employees.map((emp) => (
                                            <option key={emp.id} value={emp.id}>{emp.fullname}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleCreateTicket}
                                    disabled={formLoading || !title.trim() || !agentId}
                                    className="flex-1 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
                                >
                                    {formLoading ? "Creating..." : "Create Ticket"}
                                </button>
                                <button
                                    onClick={() => { setShowForm(false); setFormError(""); }}
                                    className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View/Update Ticket Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="bg-slate-900 px-6 py-5 text-white">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                                        Ticket #{selectedTicket.id}
                                    </p>
                                    <h2 className="mt-1 text-lg font-bold">{selectedTicket.title}</h2>
                                </div>
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 p-6">
                            <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
                                {[
                                    { label: "Assigned To", value: selectedTicket.agent_name },
                                    { label: "Department", value: selectedTicket.department_name || "—" },
                                    {
                                        label: "Priority",
                                        value: <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${priorityStyles[selectedTicket.priority]}`}>{selectedTicket.priority}</span>
                                    },
                                    {
                                        label: "Status",
                                        value: <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${statusStyles[selectedTicket.status]}`}>{selectedTicket.status}</span>
                                    },
                                    { label: "Created", value: formatDate(selectedTicket.created_at) },
                                    { label: "Resolved", value: formatDate(selectedTicket.resolved_at) },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between px-4 py-3">
                                        <span className="text-sm text-slate-500">{item.label}</span>
                                        <span className="text-sm font-medium text-slate-800">{item.value}</span>
                                    </div>
                                ))}
                            </div>

                            {selectedTicket.description && (
                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Description</p>
                                    <p className="mt-1 text-sm text-slate-700">{selectedTicket.description}</p>
                                </div>
                            )}

                            {/* Update Status */}
                            <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Update Status</p>
                                <div className="flex flex-wrap gap-2">
                                    {STATUSES.filter((s) => s !== selectedTicket.status).map((s) => (
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
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </DashboardLayout>
    );
};

export default ManagerTickets;