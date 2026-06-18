import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const MONTHS = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];

const KPIManagement = () => {
    const [kpis, setKpis] = useState([]);
    const [departmentId, setDepartmentId] = useState(null);
    const [departmentName, setDepartmentName] = useState("");
    const [loading, setLoading] = useState(true);

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);
    const [targetValue, setTargetValue] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editActual, setEditActual] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const fetchKPIs = async () => {
        try {
            setLoading(true);
            const response = await api.get("/performance/kpi");
            setKpis(response.data.kpis);
            setDepartmentId(response.data.departmentId);
            if (response.data.kpis.length > 0) {
                setDepartmentName(response.data.kpis[0].department_name);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKPIs();
    }, []);

    const handleSetKPI = async () => {
        if (!targetValue || Number(targetValue) <= 0) return;
        try {
            setActionLoading(true);
            await api.post("/performance/kpi", {
                month,
                year,
                targetValue: Number(targetValue)
            });
            setTargetValue("");
            fetchKPIs();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateActual = async (id) => {
        if (editActual === "" || Number(editActual) < 0) return;
        try {
            setActionLoading(true);
            await api.put(`/performance/kpi/${id}`, {
                actualValue: Number(editActual)
            });
            setEditingId(null);
            setEditActual("");
            fetchKPIs();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const currentKPI = kpis.find(
        (k) => k.month === currentMonth && k.year === currentYear
    );

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Manager Dashboard
                    </p>
                    <h1 className="text-3xl font-bold text-slate-800">
                        KPI Management
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Set and track monthly KPI targets for your department.
                    </p>
                </div>
                {departmentName && (
                    <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                        {departmentName}
                    </span>
                )}
            </div>

            {/* Current Month KPI Card */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Current Target
                    </p>
                    <p className="mt-2 text-4xl font-bold text-slate-800">
                        {currentKPI
                            ? Number(currentKPI.target_value).toLocaleString()
                            : "—"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        {MONTHS[currentMonth - 1]} {currentYear}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Current Actual
                    </p>
                    <p className="mt-2 text-4xl font-bold text-blue-600">
                        {currentKPI
                            ? Number(currentKPI.actual_value).toLocaleString()
                            : "—"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        Recorded this month
                    </p>
                </div>

                <div className={`rounded-xl border p-5 shadow-sm ${
                    !currentKPI ? "border-slate-100 bg-white"
                    : currentKPI.achievement >= 100 ? "border-emerald-100 bg-emerald-50"
                    : currentKPI.achievement >= 60 ? "border-amber-100 bg-amber-50"
                    : "border-rose-100 bg-rose-50"
                }`}>
                    <p className={`text-xs font-semibold uppercase tracking-wide ${
                        !currentKPI ? "text-slate-400"
                        : currentKPI.achievement >= 100 ? "text-emerald-500"
                        : currentKPI.achievement >= 60 ? "text-amber-500"
                        : "text-rose-500"
                    }`}>
                        Achievement
                    </p>
                    <p className={`mt-2 text-4xl font-bold ${
                        !currentKPI ? "text-slate-400"
                        : currentKPI.achievement >= 100 ? "text-emerald-600"
                        : currentKPI.achievement >= 60 ? "text-amber-600"
                        : "text-rose-600"
                    }`}>
                        {currentKPI ? `${currentKPI.achievement}%` : "—"}
                    </p>
                    <p className={`mt-1 text-xs ${
                        !currentKPI ? "text-slate-400"
                        : currentKPI.achievement >= 100 ? "text-emerald-400"
                        : currentKPI.achievement >= 60 ? "text-amber-400"
                        : "text-rose-400"
                    }`}>
                        {!currentKPI ? "No data"
                        : currentKPI.achievement >= 100 ? "Target exceeded!"
                        : currentKPI.achievement >= 60 ? "In progress"
                        : "Below target"}
                    </p>
                </div>
            </div>

            <div className="mb-6 grid gap-6 lg:grid-cols-2">
                {/* Set KPI Target */}
                <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                    <h2 className="mb-1 font-semibold text-slate-700">
                        Set KPI Target
                    </h2>
                    <p className="mb-5 text-xs text-slate-400">
                        Set or update a monthly KPI target for your department.
                    </p>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                                    Month
                                </label>
                                <select
                                    value={month}
                                    onChange={(e) => setMonth(Number(e.target.value))}
                                    className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none"
                                >
                                    {MONTHS.map((m, i) => (
                                        <option key={i} value={i + 1}>{m}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                                    Year
                                </label>
                                <select
                                    value={year}
                                    onChange={(e) => setYear(Number(e.target.value))}
                                    className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none"
                                >
                                    {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                                Target Value
                            </label>
                            <input
                                type="number"
                                value={targetValue}
                                onChange={(e) => setTargetValue(e.target.value)}
                                placeholder="e.g. 5000"
                                className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none"
                            />
                        </div>

                        <button
                            onClick={handleSetKPI}
                            disabled={actionLoading || !targetValue}
                            className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
                        >
                            {actionLoading ? "Saving..." : "Set KPI Target"}
                        </button>
                    </div>
                </div>

                {/* Current Month Progress */}
                {currentKPI && (
                    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-1 font-semibold text-slate-700">
                            {MONTHS[currentMonth - 1]} {currentYear} Progress
                        </h2>
                        <p className="mb-5 text-xs text-slate-400">
                            Update the actual value for this month.
                        </p>

                        <div className="mb-5">
                            <div className="mb-2 flex justify-between text-sm">
                                <span className="text-slate-500">Progress</span>
                                <span className="font-semibold text-slate-700">
                                    {currentKPI.achievement}%
                                </span>
                            </div>
                            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className={`h-3 rounded-full transition-all duration-700 ${
                                        currentKPI.achievement >= 100 ? "bg-emerald-500"
                                        : currentKPI.achievement >= 60 ? "bg-amber-400"
                                        : "bg-rose-500"
                                    }`}
                                    style={{ width: `${Math.min(currentKPI.achievement, 100)}%` }}
                                />
                            </div>
                            <div className="mt-2 flex justify-between text-xs text-slate-400">
                                <span>0</span>
                                <span>{Number(currentKPI.target_value).toLocaleString()}</span>
                            </div>
                        </div>

                        {editingId === currentKPI.id ? (
                            <div className="space-y-3">
                                <input
                                    type="number"
                                    value={editActual}
                                    onChange={(e) => setEditActual(e.target.value)}
                                    placeholder="Enter actual value"
                                    className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleUpdateActual(currentKPI.id)}
                                        disabled={actionLoading}
                                        className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                                    >
                                        {actionLoading ? "Saving..." : "Save"}
                                    </button>
                                    <button
                                        onClick={() => { setEditingId(null); setEditActual(""); }}
                                        className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => {
                                    setEditingId(currentKPI.id);
                                    setEditActual(currentKPI.actual_value);
                                }}
                                className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Update Actual Value
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* KPI History Table */}
            <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-4">
                    <h2 className="font-semibold text-slate-700">KPI History</h2>
                    <p className="mt-0.5 text-xs text-slate-400">
                        All monthly KPI records for your department
                    </p>
                </div>

                {loading ? (
                    <div className="flex h-40 items-center justify-center">
                        <p className="text-sm text-slate-400">Loading KPIs...</p>
                    </div>
                ) : kpis.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center text-center">
                        <p className="text-sm font-medium text-slate-600">No KPI records yet</p>
                        <p className="mt-1 text-xs text-slate-400">
                            Set your first KPI target using the form above.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="px-5 py-3 text-left font-semibold">Period</th>
                                    <th className="px-5 py-3 text-left font-semibold">Target</th>
                                    <th className="px-5 py-3 text-left font-semibold">Actual</th>
                                    <th className="px-5 py-3 text-left font-semibold">Achievement</th>
                                    <th className="px-5 py-3 text-left font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {kpis.map((kpi) => (
                                    <tr key={kpi.id} className="hover:bg-slate-50">
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-slate-800">
                                                {MONTHS[kpi.month - 1]} {kpi.year}
                                            </p>
                                            {kpi.month === currentMonth && kpi.year === currentYear && (
                                                <span className="text-xs font-semibold text-violet-500">
                                                    Current
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-slate-700">
                                            {Number(kpi.target_value).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-slate-700">
                                            {Number(kpi.actual_value).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                                                    <div
                                                        className={`h-2 rounded-full ${
                                                            kpi.achievement >= 100 ? "bg-emerald-500"
                                                            : kpi.achievement >= 60 ? "bg-amber-400"
                                                            : "bg-rose-500"
                                                        }`}
                                                        style={{ width: `${Math.min(kpi.achievement, 100)}%` }}
                                                    />
                                                </div>
                                                <span className={`text-sm font-semibold ${
                                                    kpi.achievement >= 100 ? "text-emerald-600"
                                                    : kpi.achievement >= 60 ? "text-amber-600"
                                                    : "text-rose-600"
                                                }`}>
                                                    {kpi.achievement}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            {editingId === kpi.id ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={editActual}
                                                        onChange={(e) => setEditActual(e.target.value)}
                                                        className="w-24 rounded-lg border border-slate-200 px-2 py-1 text-sm focus:outline-none"
                                                    />
                                                    <button
                                                        onClick={() => handleUpdateActual(kpi.id)}
                                                        disabled={actionLoading}
                                                        className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => { setEditingId(null); setEditActual(""); }}
                                                        className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setEditingId(kpi.id);
                                                        setEditActual(kpi.actual_value);
                                                    }}
                                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                                >
                                                    Edit Actual
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
        </DashboardLayout>
    );
};

export default KPIManagement;