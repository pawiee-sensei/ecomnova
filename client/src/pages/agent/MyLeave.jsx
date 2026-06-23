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
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    rejected: "bg-rose-50 text-rose-700 ring-rose-200",
};

const leaveTypeStyles = {
    sick: "bg-rose-50 text-rose-600",
    vacation: "bg-blue-50 text-blue-600",
    emergency: "bg-orange-50 text-orange-600",
    personal: "bg-purple-50 text-purple-600",
    other: "bg-slate-50 text-slate-600",
};

const LEAVE_TYPES = ["sick", "vacation", "emergency", "personal", "other"];

const getDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    return diff;
};

const MyLeave = () => {
    const [summary, setSummary] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [showForm, setShowForm] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Form state
    const [leaveType, setLeaveType] = useState("sick");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const fetchLeave = async () => {
        try {
            setLoading(true);
            const response = await api.get("/agent/leave");
            setSummary(response.data.summary);
            setRequests(response.data.requests);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeave();
    }, []);

    const handleSubmit = async () => {
        if (!leaveType || !startDate || !endDate || !reason.trim()) {
            setErrorMessage("All fields are required.");
            return;
        }
        if (new Date(endDate) < new Date(startDate)) {
            setErrorMessage("End date cannot be before start date.");
            return;
        }
        try {
            setSubmitting(true);
            setErrorMessage("");
            await api.post("/agent/leave", { leaveType, startDate, endDate, reason });
            setSuccessMessage("Leave request submitted successfully!");
            setShowForm(false);
            setLeaveType("sick");
            setStartDate("");
            setEndDate("");
            setReason("");
            fetchLeave();
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to submit leave request.");
        } finally {
            setSubmitting(false);
        }
    };

    const filtered = statusFilter === "all"
        ? requests
        : requests.filter((r) => r.status === statusFilter);

    return (
        <DashboardLayout>

            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Agent Portal
                    </p>
                    <h1 className="text-3xl font-bold text-slate-800">
                        My Leave
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Submit and track your leave requests.
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
                >
                    + Request Leave
                </button>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    ✓ {successMessage}
                </div>
            )}

            {/* Summary Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
                {[
                    { label: "Pending", value: summary?.pendingCount || 0, accent: "border-l-amber-500" },
                    { label: "Approved", value: summary?.approvedCount || 0, accent: "border-l-emerald-500" },
                    { label: "Rejected", value: summary?.rejectedCount || 0, accent: "border-l-rose-500" },
                ].map((card) => (
                    <div key={card.label} className={`rounded-xl border border-slate-100 border-l-4 bg-white p-5 shadow-sm ${card.accent}`}>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{card.label}</p>
                        <p className="mt-2 text-4xl font-bold text-slate-800">{card.value}</p>
                        <p className="mt-1 text-xs text-slate-400">requests</p>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div className="mb-4 flex flex-wrap gap-2">
                {["all", "pending", "approved", "rejected"].map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-all ${
                            statusFilter === s
                                ? "bg-slate-900 text-white"
                                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                    >
                        {s === "all" ? "All Requests" : s}
                    </button>
                ))}
            </div>

            {/* Requests Table */}
            <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
                {loading ? (
                    <div className="flex h-40 items-center justify-center">
                        <p className="text-sm text-slate-400">Loading leave requests...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center text-center">
                        <p className="text-sm font-medium text-slate-600">No requests found</p>
                        <p className="mt-1 text-xs text-slate-400">
                            {statusFilter === "all"
                                ? "You haven't submitted any leave requests yet."
                                : `No ${statusFilter} leave requests.`}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="px-5 py-3 text-left font-semibold">Leave Type</th>
                                    <th className="px-5 py-3 text-left font-semibold">Duration</th>
                                    <th className="px-5 py-3 text-left font-semibold">Days</th>
                                    <th className="px-5 py-3 text-left font-semibold">Status</th>
                                    <th className="px-5 py-3 text-left font-semibold">Filed</th>
                                    <th className="px-5 py-3 text-left font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((request) => (
                                    <tr key={request.id} className="hover:bg-slate-50">
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${leaveTypeStyles[request.leave_type]}`}>
                                                {request.leave_type}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-slate-600">
                                            <p>{formatDate(request.start_date)}</p>
                                            <p className="text-xs text-slate-400">to {formatDate(request.end_date)}</p>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                                            {getDays(request.start_date, request.end_date)} days
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${statusStyles[request.status]}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-slate-400">
                                            {formatDate(request.created_at)}
                                        </td>
                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() => setSelectedRequest(request)}
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

            {/* Submit Leave Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="bg-slate-900 px-6 py-5 text-white">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-lg font-bold">Request Leave</h2>
                                    <p className="mt-0.5 text-sm text-slate-400">
                                        Fill in the details and submit.
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowForm(false);
                                        setErrorMessage("");
                                    }}
                                    className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 p-6">
                            {errorMessage && (
                                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                    {errorMessage}
                                </div>
                            )}

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                                    Leave Type
                                </label>
                                <select
                                    value={leaveType}
                                    onChange={(e) => setLeaveType(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none"
                                >
                                    {LEAVE_TYPES.map((t) => (
                                        <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {startDate && endDate && new Date(endDate) >= new Date(startDate) && (
                                <div className="rounded-lg bg-slate-50 px-4 py-2 text-sm text-slate-600">
                                    Duration: <span className="font-semibold">{getDays(startDate, endDate)} day(s)</span>
                                </div>
                            )}

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                                    Reason
                                </label>
                                <textarea
                                    rows="4"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Explain the reason for your leave..."
                                    className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting || !leaveType || !startDate || !endDate || !reason.trim()}
                                    className="flex-1 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
                                >
                                    {submitting ? "Submitting..." : "Submit Request"}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowForm(false);
                                        setErrorMessage("");
                                    }}
                                    className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Request Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="bg-slate-900 px-6 py-5 text-white">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-lg font-bold">Leave Request</h2>
                                    <p className="mt-0.5 text-sm text-slate-400 capitalize">
                                        {selectedRequest.leave_type} leave
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3 p-6">
                            <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
                                {[
                                    { label: "Leave Type", value: <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${leaveTypeStyles[selectedRequest.leave_type]}`}>{selectedRequest.leave_type}</span> },
                                    { label: "Start Date", value: formatDate(selectedRequest.start_date) },
                                    { label: "End Date", value: formatDate(selectedRequest.end_date) },
                                    { label: "Days", value: `${getDays(selectedRequest.start_date, selectedRequest.end_date)} days` },
                                    { label: "Status", value: <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${statusStyles[selectedRequest.status]}`}>{selectedRequest.status}</span> },
                                    { label: "Filed", value: formatDate(selectedRequest.created_at) },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between px-4 py-3">
                                        <span className="text-sm text-slate-500">{item.label}</span>
                                        <span className="text-sm font-medium text-slate-800">{item.value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Reason</p>
                                <p className="mt-1 text-sm text-slate-700">{selectedRequest.reason}</p>
                            </div>

                            {selectedRequest.manager_note && (
                                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">Manager Note</p>
                                    <p className="mt-1 text-sm text-blue-800">{selectedRequest.manager_note}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </DashboardLayout>
    );
};

export default MyLeave;