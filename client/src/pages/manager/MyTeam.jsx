import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const statusStyles = {
    active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    inactive: "bg-slate-100 text-slate-700 ring-slate-200",
    suspended: "bg-amber-50 text-amber-700 ring-amber-200",
    terminated: "bg-rose-50 text-rose-700 ring-rose-200",
};

const formatLabel = (value) => {
    if (!value) return "Unassigned";
    return value.replaceAll("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-US", {
        month: "short", day: "numeric", year: "numeric",
    }).format(date);
};

const COACHING_CATEGORIES = [
    "performance", "training", "attendance",
    "leadership", "recognition", "behavior",
];

const MyTeam = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [modalTab, setModalTab] = useState("profile");

    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [category, setCategory] = useState("performance");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [noteLoading, setNoteLoading] = useState(false);

    const fetchTeam = async () => {
        try {
            setLoading(true);
            setErrorMessage("");
            const response = await api.get("/manager/team");
            setEmployees(response.data);
        } catch (error) {
            console.error("Team fetch failed:", error);
            setErrorMessage("Unable to load your team right now.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCoachingNotes = async (employeeId) => {
        try {
            const response = await api.get(`/manager/coaching-notes/${employeeId}`);
            setNotes(response.data);
        } catch (error) {
            console.error("Failed to load coaching notes:", error);
        }
    };

    const createNote = async () => {
        if (!newNote.trim()) return;
        try {
            setNoteLoading(true);
            await api.post("/manager/coaching-notes", {
                employeeId: selectedEmployee.id,
                category,
                note: newNote,
            });
            setNewNote("");
            setCategory("performance");
            fetchCoachingNotes(selectedEmployee.id);
        } catch (error) {
            console.error("Failed to create note:", error);
        } finally {
            setNoteLoading(false);
        }
    };

    const openModal = async (employee) => {
        setSelectedEmployee(employee);
        setModalTab("profile");
        setNotes([]);
        setNewNote("");
        setCategoryFilter("all");
        fetchCoachingNotes(employee.id);
    };

    const closeModal = () => {
        setSelectedEmployee(null);
        setNotes([]);
        setNewNote("");
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    const roles = [...new Set(employees.map((e) => e.role))];
    const statuses = [...new Set(employees.map((e) => e.status))];

    const filteredEmployees = employees.filter((e) => {
        const matchesSearch =
            e.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = !roleFilter || e.role === roleFilter;
        const matchesStatus = !statusFilter || e.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const filteredNotes =
        categoryFilter === "all"
            ? notes
            : notes.filter((n) => n.category === categoryFilter);

    const teamName = employees[0]?.team_name || "—";
    const departmentName = employees[0]?.department_name || "—";

    return (
        <DashboardLayout>
            <div className="space-y-6">

                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                            Manager Dashboard
                        </p>
                        <h1 className="text-3xl font-bold text-slate-950">
                            My Team
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Employees currently assigned to you.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                                {teamName}
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                                {departmentName}
                            </span>
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase text-slate-500">
                            Team Members
                        </p>
                        <p className="mt-1 text-3xl font-bold text-slate-950">
                            {employees.length}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <input
                        type="text"
                        placeholder="Search employee..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-72 rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none"
                    />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none"
                    >
                        <option value="">All Roles</option>
                        {roles.map((role) => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none"
                    >
                        <option value="">All Statuses</option>
                        {statuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>

                {errorMessage && (
                    <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                        {errorMessage}
                    </div>
                )}

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    {loading ? (
                        <div className="p-8 text-sm text-slate-500">Loading team members...</div>
                    ) : employees.length === 0 ? (
                        <div className="p-8 text-sm text-slate-500">No employees are assigned to you yet.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[860px]">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                    <tr>
                                        <th className="px-5 py-3 text-left font-semibold">Employee</th>
                                        <th className="px-5 py-3 text-left font-semibold">Email</th>
                                        <th className="px-5 py-3 text-left font-semibold">Role</th>
                                        <th className="px-5 py-3 text-center font-semibold">Status</th>
                                        <th className="px-5 py-3 text-left font-semibold">Job Title</th>
                                        <th className="px-5 py-3 text-left font-semibold">Shift</th>
                                        <th className="px-5 py-3 text-left font-semibold">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredEmployees.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="p-8 text-center text-slate-500">
                                                No team members found.
                                            </td>
                                        </tr>
                                    )}
                                    {filteredEmployees.map((employee) => (
                                        <tr key={employee.id} className="hover:bg-slate-50">
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-slate-950">{employee.fullname}</p>
                                                <p className="mt-0.5 text-xs text-slate-400">{employee.employee_id}</p>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-slate-600">{employee.email}</td>
                                            <td className="px-5 py-4 text-sm text-slate-600">{formatLabel(employee.role)}</td>
                                            <td className="px-5 py-4 text-center">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusStyles[employee.status] || statusStyles.inactive}`}>
                                                    {formatLabel(employee.status)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-slate-600">{employee.job_title || "Not set"}</td>
                                            <td className="px-5 py-4 text-sm text-slate-600">{employee.shift || "Not set"}</td>
                                            <td className="px-5 py-4">
                                                <button
                                                    onClick={() => openModal(employee)}
                                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                                                >
                                                    View Profile
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Profile Modal */}
            {selectedEmployee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">

                        {/* Modal Header */}
                        <div className="bg-slate-900 px-6 py-5 text-white">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                                        Team Member
                                    </p>
                                    <h2 className="mt-1 text-xl font-bold">
                                        {selectedEmployee.fullname}
                                    </h2>
                                    <p className="mt-0.5 text-sm text-slate-400">
                                        {selectedEmployee.job_title || "No job title"}
                                    </p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20"
                                >
                                    Close
                                </button>
                            </div>
                            <div className="mt-4 flex gap-1">
                                {["profile", "coaching"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setModalTab(tab)}
                                        className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all capitalize ${
                                            modalTab === tab
                                                ? "bg-white text-slate-900"
                                                : "text-slate-400 hover:text-white"
                                        }`}
                                    >
                                        {tab === "coaching" ? "Coaching Notes" : "Profile"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="max-h-[70vh] overflow-y-auto p-6">

                            {/* Profile Tab */}
                            {modalTab === "profile" && (
                                <div className="space-y-6">

                                    {/* Avatar + Name */}
                                    <div className="flex items-center gap-5 rounded-xl bg-slate-50 p-5">
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xl font-bold text-white">
                                            {selectedEmployee.fullname
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">
                                                {selectedEmployee.fullname}
                                            </h3>
                                            <p className="text-sm text-slate-500">
                                                {selectedEmployee.job_title || "No job title"}
                                            </p>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${statusStyles[selectedEmployee.status] || statusStyles.inactive}`}>
                                                    {formatLabel(selectedEmployee.status)}
                                                </span>
                                                <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                                                    {formatLabel(selectedEmployee.role)}
                                                </span>
                                                <span className="inline-flex rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
                                                    {selectedEmployee.employee_id}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact */}
                                    <div>
                                        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                                            Contact
                                        </p>
                                        <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
                                            <div className="flex items-center justify-between px-4 py-3">
                                                <span className="text-sm text-slate-500">Email</span>
                                                <span className="text-sm font-medium text-slate-800">{selectedEmployee.email}</span>
                                            </div>
                                            <div className="flex items-center justify-between px-4 py-3">
                                                <span className="text-sm text-slate-500">Work Location</span>
                                                <span className="text-sm font-medium text-slate-800">{selectedEmployee.work_location || "—"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Employment */}
                                    <div>
                                        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                                            Employment
                                        </p>
                                        <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
                                            <div className="flex items-center justify-between px-4 py-3">
                                                <span className="text-sm text-slate-500">Employment Type</span>
                                                <span className="text-sm font-medium text-slate-800">{formatLabel(selectedEmployee.employment_type)}</span>
                                            </div>
                                            <div className="flex items-center justify-between px-4 py-3">
                                                <span className="text-sm text-slate-500">Hire Date</span>
                                                <span className="text-sm font-medium text-slate-800">{formatDate(selectedEmployee.hire_date)}</span>
                                            </div>
                                            <div className="flex items-center justify-between px-4 py-3">
                                                <span className="text-sm text-slate-500">Shift</span>
                                                <span className="text-sm font-medium text-slate-800">{selectedEmployee.shift || "—"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Team & Department */}
                                    <div>
                                        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                                            Team & Department
                                        </p>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-violet-400">Team</p>
                                                <p className="mt-1 font-semibold text-violet-800">{selectedEmployee.team_name || "—"}</p>
                                            </div>
                                            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">Department</p>
                                                <p className="mt-1 font-semibold text-blue-800">{selectedEmployee.department_name || "—"}</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}

                            {/* Coaching Notes Tab */}
                            {modalTab === "coaching" && (
                                <div className="space-y-5">

                                    {/* Add Note */}
                                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Add Note
                                        </p>
                                        <textarea
                                            rows="3"
                                            value={newNote}
                                            onChange={(e) => setNewNote(e.target.value)}
                                            placeholder="Write a coaching note..."
                                            className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none"
                                        />
                                        <div className="mt-3 flex gap-3">
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="flex-1 rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none"
                                            >
                                                {COACHING_CATEGORIES.map((c) => (
                                                    <option key={c} value={c}>{formatLabel(c)}</option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={createNote}
                                                disabled={noteLoading || !newNote.trim()}
                                                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
                                            >
                                                {noteLoading ? "Saving..." : "Add Note"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Category Filter */}
                                    <div className="flex flex-wrap gap-2">
                                        {["all", ...COACHING_CATEGORIES].map((c) => (
                                            <button
                                                key={c}
                                                onClick={() => setCategoryFilter(c)}
                                                className={`rounded-full px-3 py-1 text-xs font-medium transition-all capitalize ${
                                                    categoryFilter === c
                                                        ? "bg-slate-900 text-white"
                                                        : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                                }`}
                                            >
                                                {c === "all" ? "All" : formatLabel(c)}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Notes List */}
                                    {filteredNotes.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-10 text-center">
                                            <p className="text-sm text-slate-500">No coaching notes yet.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {filteredNotes.map((note) => (
                                                <div key={note.id} className="rounded-xl border border-slate-100 p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-semibold text-slate-700">{note.manager_name}</p>
                                                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs capitalize text-slate-500">
                                                                {note.category}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-slate-400">{formatDate(note.created_at)}</p>
                                                    </div>
                                                    <p className="mt-2 text-sm text-slate-600">{note.note}</p>
                                                </div>
                                            ))}
                                        </div>
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

export default MyTeam;