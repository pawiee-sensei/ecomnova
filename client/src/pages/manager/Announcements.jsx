import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const statusStyles = {
    upcoming: "bg-amber-50 text-amber-700 ring-amber-200",
    active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    implemented: "bg-blue-50 text-blue-700 ring-blue-200",
    archived: "bg-slate-100 text-slate-500 ring-slate-200",
};

const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
};

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("upcoming");
    const [effectiveDate, setEffectiveDate] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [activeTab, setActiveTab] = useState("upcoming");
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const upcoming = announcements.filter((a) => a.status === "upcoming");
    const active = announcements.filter((a) => a.status === "active");
    const implemented = announcements.filter((a) => a.status === "implemented");
    const archived = announcements.filter((a) => a.status === "archived");

    const tabs = [
        { key: "upcoming", label: "Upcoming", count: upcoming.length },
        { key: "active", label: "Active", count: active.length },
        { key: "implemented", label: "Implemented", count: implemented.length },
        { key: "archived", label: "Archived", count: archived.length },
    ];

    const currentAnnouncements = {
        upcoming,
        active,
        implemented,
        archived,
    }[activeTab];

    const showSuccess = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(""), 3000);
    };

    const fetchAnnouncements = async () => {
        try {
            const response = await api.get("/manager/announcements");
            setAnnouncements(response.data);
        } catch (error) {
            console.error("Failed to load announcements:", error);
        }
    };

    const createAnnouncement = async () => {
        if (!title.trim() || !content.trim() || !effectiveDate) return;
        try {
            setLoading(true);
            await api.post("/manager/announcements", {
                title,
                content,
                status,
                effectiveDate,
            });
            setTitle("");
            setContent("");
            setStatus("upcoming");
            setEffectiveDate("");
            showSuccess("Announcement created successfully!");
            setShowForm(false);
            fetchAnnouncements();
        } catch (error) {
            console.error("Failed to create announcement:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateAnnouncement = async () => {
        try {
            setLoading(true);
            await api.put(`/manager/announcements/${editingId}`, {
                title,
                content,
                status,
                effectiveDate,
            });
            setEditingId(null);
            setTitle("");
            setContent("");
            setStatus("upcoming");
            setEffectiveDate("");
            showSuccess("Announcement updated successfully!");
            setShowForm(false);
            fetchAnnouncements();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const archiveAnnouncement = async (announcementId) => {
        try {
            await api.put(`/manager/announcements/${announcementId}/archive`);
            showSuccess("Announcement archived.");
            fetchAnnouncements();
        } catch (error) {
            console.error("Failed to archive announcement:", error);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setShowForm(false);
        setTitle("");
        setContent("");
        setStatus("upcoming");
        setEffectiveDate("");
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    return (
        <DashboardLayout>
{/* Header */}
<div className="mb-8 flex items-start justify-between">
    <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Manager Dashboard
        </p>
        <h1 className="text-3xl font-bold text-slate-800">
            Announcements
        </h1>
        <p className="mt-1 text-slate-500">
            Manage team announcements and upcoming changes.
        </p>
    </div>
    <div className="flex items-center gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {announcements.length} total
        </span>
        <button
            onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setTitle("");
                setContent("");
                setStatus("upcoming");
                setEffectiveDate("");
            }}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
            + Create Announcement
        </button>
    </div>
</div>

            {/* Success Message */}
            {successMessage && (
                <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    ✓ {successMessage}
                </div>
            )}



            {/* Tabs */}
            <div className="mb-4 flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                            activeTab === tab.key
                                ? "bg-slate-900 text-white"
                                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                    >
                        {tab.label}
                        <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                            activeTab === tab.key
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
                {currentAnnouncements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="mb-3 text-3xl">📢</div>
                        <p className="text-sm font-medium text-slate-600">
                            No {activeTab} announcements
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                            {activeTab === "upcoming"
                                ? "Create an announcement to get started."
                                : `No announcements in ${activeTab} status yet.`}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {currentAnnouncements.map((announcement) => (
                            <div
                                key={announcement.id}
                                className="p-5 hover:bg-slate-50"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-slate-800">
                                                {announcement.title}
                                            </h3>
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${statusStyles[announcement.status]}`}>
                                                {announcement.status}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-slate-600">
                                            {announcement.content}
                                        </p>
                                        <p className="mt-2 text-xs text-slate-400">
                                            Effective: {formatDate(announcement.effective_date)}
                                        </p>
                                    </div>

                                    {announcement.status !== "archived" && (
                                        <div className="flex shrink-0 gap-2">
                                            <button
                                            onClick={() => {
                                                setEditingId(announcement.id);
                                                setTitle(announcement.title);
                                                setContent(announcement.content);
                                                setStatus(announcement.status);
                                                setEffectiveDate(announcement.effective_date);
                                                setShowForm(true);
                                            }}
                                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm("Archive this announcement?")) {
                                                        archiveAnnouncement(announcement.id);
                                                    }
                                                }}
                                                className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                                            >
                                                Archive
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create / Edit Modal */}
{(showForm || editingId) && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-5 text-white">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-bold">
                            {editingId ? "Edit Announcement" : "Create Announcement"}
                        </h2>
                        <p className="mt-0.5 text-sm text-slate-400">
                            {editingId
                                ? "Update the details below and save."
                                : "Fill in the details to post a new announcement."}
                        </p>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20"
                    >
                        Close
                    </button>
                </div>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 p-6">
                <input
                    type="text"
                    placeholder="Announcement title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none"
                />

                <textarea
                    rows="7"
                    placeholder="Announcement details..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none"
                />

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none"
                        >
                            <option value="upcoming">Upcoming</option>
                            <option value="active">Active</option>
                            <option value="implemented">Implemented</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                            Effective Date
                        </label>
                        <input
                            type="date"
                            value={effectiveDate}
                            onChange={(e) => setEffectiveDate(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={editingId ? updateAnnouncement : createAnnouncement}
                        disabled={loading || !title.trim() || !content.trim() || !effectiveDate}
                        className="flex-1 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
                    >
                        {loading
                            ? "Saving..."
                            : editingId
                            ? "Update Announcement"
                            : "Create Announcement"}
                    </button>
                    <button
                        onClick={handleCancel}
                        className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
)};

        </DashboardLayout>
    );
};

export default Announcements;