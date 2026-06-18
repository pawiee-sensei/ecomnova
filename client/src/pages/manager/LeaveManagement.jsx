import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const statusStyles = {
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    rejected: "bg-rose-50 text-rose-700 ring-rose-200",
};

const leaveTypeStyles = {
    sick: "bg-red-50 text-red-600",
    vacation: "bg-blue-50 text-blue-600",
    emergency: "bg-orange-50 text-orange-600",
    personal: "bg-purple-50 text-purple-600",
    other: "bg-slate-50 text-slate-600",
};

const LeaveManagement = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [managerNote, setManagerNote] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [actionLoading, setActionLoading] = useState(false);

    const fetchLeaveRequests = async () => {
        try {
            setLoading(true);
            const response = await api.get("/manager/leave");
            setRequests(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaveRequests();
    }, []);

    const handleApprove = async (id) => {
        try {
            setActionLoading(true);
            await api.put(`/manager/leave/${id}/approve`, { managerNote });
            setSelectedRequest(null);
            setManagerNote("");
            fetchLeaveRequests();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (id) => {
        if (!managerNote.trim()) {
            alert("Please provide a reason for rejection.");
            return;
        }
        try {
            setActionLoading(true);
            await api.put(`/manager/leave/${id}/reject`, { managerNote });
            setSelectedRequest(null);
            setManagerNote("");
            fetchLeaveRequests();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const getDays = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diff = Math.ceil(
            (endDate - startDate) / (1000 * 60 * 60 * 24)
        ) + 1;
        return diff;
    };

    const filtered = statusFilter === "all"
        ? requests
        : requests.filter((r) => r.status === statusFilter);

    const pending = requests.filter((r) => r.status === "pending");
    const approved = requests.filter((r) => r.status === "approved");
    const rejected = requests.filter((r) => r.status === "rejected");

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Manager Dashboard
                    </p>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Leave Management
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Review and manage your team's leave requests.
                    </p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-amber-100 bg-amber-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-500">
                        Pending
                    </p>
                    <p className="mt-2 text-4xl font-bold text-amber-600">
                        {pending.length}
                    </p>
                    <p className="mt-1 text-xs text-amber-400">
                        Awaiting your review
                    </p>
                </div>

                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">
                        Approved
                    </p>
                    <p className="mt-2 text-4xl font-bold text-emerald-600">
                        {approved.length}
                    </p>
                    <p className="mt-1 text-xs text-emerald-400">
                        This period
                    </p>
                </div>

                <div className="rounded-xl border border-rose-100 bg-rose-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">
                        Rejected
                    </p>
                    <p className="mt-2 text-4xl font-bold text-rose-600">
                        {rejected.length}
                    </p>
                    <p className="mt-1 text-xs text-rose-400">
                        This period
                    </p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="mb-4 flex gap-2">
                {["all", "pending", "approved", "rejected"].map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                            statusFilter === s
                                ? "bg-slate-900 text-white"
                                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                    >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                        {s === "pending" && pending.length > 0 && (
                            <span className="ml-2 rounded-full bg-amber-400 px-1.5 py-0.5 text-xs text-white">
                                {pending.length}
                            </span>
                        )}
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
                            {statusFilter === "pending"
                                ? "No pending leave requests."
                                : "No leave requests in this category."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="px-5 py-3 text-left font-semibold">Employee</th>
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
                                    <tr
                                        key={request.id}
                                        className="hover:bg-slate-50"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-slate-800">
                                                {request.employee_name}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {request.job_title || "—"}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                                leaveTypeStyles[request.leave_type]
                                            }`}>
                                                {request.leave_type}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-slate-600">
                                            <p>{new Date(request.start_date).toLocaleDateString()}</p>
                                            <p className="text-xs text-slate-400">
                                                to {new Date(request.end_date).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-sm font-semibold text-slate-700">
                                                {getDays(request.start_date, request.end_date)} days
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 capitalize ${
                                                statusStyles[request.status]
                                            }`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-slate-400">
                                            {new Date(request.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-5 py-4">
                                            {request.status === "pending" ? (
                                                <button
                                                    onClick={() => {
                                                        setSelectedRequest(request);
                                                        setManagerNote("");
                                                    }}
                                                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
                                                >
                                                    Review
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setSelectedRequest(request);
                                                        setManagerNote(request.manager_note || "");
                                                    }}
                                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                                >
                                                    View
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

                        {/* Modal Header */}
                        <div className="mb-5 flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">
                                    Leave Request
                                </h2>
                                <p className="text-sm text-slate-400">
                                    {selectedRequest.employee_name}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Details */}
                        <div className="mb-5 space-y-3 rounded-xl bg-slate-50 p-4">
                            <div className="flex justify-between">
                                <span className="text-xs text-slate-400">Leave Type</span>
                                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                                    leaveTypeStyles[selectedRequest.leave_type]
                                }`}>
                                    {selectedRequest.leave_type}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs text-slate-400">Duration</span>
                                <span className="text-xs font-semibold text-slate-700">
                                    {new Date(selectedRequest.start_date).toLocaleDateString()} — {new Date(selectedRequest.end_date).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs text-slate-400">Days</span>
                                <span className="text-xs font-semibold text-slate-700">
                                    {getDays(selectedRequest.start_date, selectedRequest.end_date)} days
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs text-slate-400">Status</span>
                                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ring-1 capitalize ${
                                    statusStyles[selectedRequest.status]
                                }`}>
                                    {selectedRequest.status}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Reason</p>
                                <p className="mt-1 text-sm text-slate-700">
                                    {selectedRequest.reason}
                                </p>
                            </div>
                        </div>

                        {/* Manager Note */}
                        {selectedRequest.status === "pending" ? (
                            <>
                                <div className="mb-4">
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                                        Note <span className="text-slate-400">(required for rejection)</span>
                                    </label>
                                    <textarea
                                        rows="3"
                                        value={managerNote}
                                        onChange={(e) => setManagerNote(e.target.value)}
                                        placeholder="Add a note for the employee..."
                                        className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleApprove(selectedRequest.id)}
                                        disabled={actionLoading}
                                        className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                                    >
                                        {actionLoading ? "Processing..." : "✓ Approve"}
                                    </button>
                                    <button
                                        onClick={() => handleReject(selectedRequest.id)}
                                        disabled={actionLoading}
                                        className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                                    >
                                        {actionLoading ? "Processing..." : "✕ Reject"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {selectedRequest.manager_note && (
                                    <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                                        <p className="text-xs font-semibold text-slate-400">Manager Note</p>
                                        <p className="mt-1 text-sm text-slate-700">
                                            {selectedRequest.manager_note}
                                        </p>
                                    </div>
                                )}
                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    Close
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default LeaveManagement;