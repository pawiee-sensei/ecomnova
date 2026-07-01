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
    upcoming: "bg-amber-50 text-amber-700 ring-amber-200",
    active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    implemented: "bg-blue-50 text-blue-700 ring-blue-200",
};

const statusAccent = {
    upcoming: "border-l-amber-500",
    active: "border-l-emerald-500",
    implemented: "border-l-blue-500",
};

const AgentAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await api.get("/agent/announcements");
            setAnnouncements(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const active = announcements.filter((a) => a.status === "active");
    const upcoming = announcements.filter((a) => a.status === "upcoming");
    const implemented = announcements.filter((a) => a.status === "implemented");

    const filtered = statusFilter === "all"
        ? announcements
        : announcements.filter((a) => a.status === statusFilter);

    const tabs = [
        { key: "all", label: "All", count: announcements.length },
        { key: "active", label: "Active", count: active.length },
        { key: "upcoming", label: "Upcoming", count: upcoming.length },
        { key: "implemented", label: "Implemented", count: implemented.length },
    ];

    return (
        <DashboardLayout>

            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Agent Portal
                    </p>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Announcements
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Stay updated with the latest announcements from your manager.
                    </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {announcements.length} total
                </span>
            </div>

            {/* Summary Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
                {[
                    { label: "Active", value: active.length, accent: "border-l-emerald-500" },
                    { label: "Upcoming", value: upcoming.length, accent: "border-l-amber-500" },
                    { label: "Implemented", value: implemented.length, accent: "border-l-blue-500" },
                ].map((card) => (
                    <div key={card.label} className={`rounded-xl border border-slate-100 border-l-4 bg-white p-5 shadow-sm ${card.accent}`}>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{card.label}</p>
                        <p className="mt-2 text-4xl font-bold text-slate-800">{card.value}</p>
                        <p className="mt-1 text-xs text-slate-400">announcements</p>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div className="mb-4 flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setStatusFilter(tab.key)}
                        className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                            statusFilter === tab.key
                                ? "bg-slate-900 text-white"
                                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                    >
                        {tab.label}
                        <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                            statusFilter === tab.key
                                ? "bg-white text-slate-900"
                                : "bg-slate-100 text-slate-500"
                        }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Announcements List */}
            <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
                {loading ? (
                    <div className="flex h-40 items-center justify-center">
                        <p className="text-sm text-slate-400">Loading announcements...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center text-center">
                        <div className="mb-2 text-2xl">📢</div>
                        <p className="text-sm font-medium text-slate-600">No announcements</p>
                        <p className="mt-1 text-xs text-slate-400">
                            {statusFilter === "all"
                                ? "Your manager hasn't posted any announcements yet."
                                : `No ${statusFilter} announcements.`}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filtered.map((announcement) => (
                            <div
                                key={announcement.id}
                                className={`border-l-4 p-5 hover:bg-slate-50 cursor-pointer ${statusAccent[announcement.status] || "border-l-slate-200"}`}
                                onClick={() => setSelectedAnnouncement(announcement)}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-slate-800">
                                                {announcement.title}
                                            </h3>
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${statusStyles[announcement.status] || "bg-slate-100 text-slate-500 ring-slate-200"}`}>
                                                {announcement.status}
                                            </span>
                                        </div>
                                        <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">
                                            {announcement.content}
                                        </p>
                                        <p className="mt-2 text-xs text-slate-400">
                                            Effective: {formatDate(announcement.effective_date)}
                                        </p>
                                    </div>
                                    <span className="shrink-0 text-xs text-slate-400">
                                        {formatDate(announcement.created_at)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* View Announcement Modal */}
            {selectedAnnouncement && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

                        {/* Modal Header */}
                        <div className={`border-l-4 bg-slate-900 px-6 py-5 text-white ${statusAccent[selectedAnnouncement.status] || "border-l-slate-500"}`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${statusStyles[selectedAnnouncement.status]}`}>
                                            {selectedAnnouncement.status}
                                        </span>
                                    </div>
                                    <h2 className="mt-2 text-lg font-bold">
                                        {selectedAnnouncement.title}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setSelectedAnnouncement(null)}
                                    className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
                                <div className="flex items-center justify-between px-4 py-3">
                                    <span className="text-sm text-slate-500">Effective Date</span>
                                    <span className="text-sm font-medium text-slate-800">
                                        {formatDate(selectedAnnouncement.effective_date)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between px-4 py-3">
                                    <span className="text-sm text-slate-500">Posted</span>
                                    <span className="text-sm font-medium text-slate-800">
                                        {formatDate(selectedAnnouncement.created_at)}
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Announcement
                                </p>
                                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                                    {selectedAnnouncement.content}
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedAnnouncement(null)}
                                className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </DashboardLayout>
    );
};

export default AgentAnnouncements;