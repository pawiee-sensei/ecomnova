import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const MONTHS = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];

const MyPerformance = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const fetchPerformance = async () => {
        try {
            setLoading(true);
            const response = await api.get("/agent/performance");
            setRecords(response.data);
            if (response.data.length > 0) {
                setSelectedRecord(response.data[0]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPerformance();
    }, []);

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const currentRecord = records.find(
        (r) => r.month === currentMonth && r.year === currentYear
    );

    return (
        <DashboardLayout>

            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Agent Portal
                    </p>
                    <h1 className="text-3xl font-bold text-slate-800">
                        My Performance
                    </h1>
                    <p className="mt-1 text-slate-500">
                        View your monthly performance metrics.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex h-40 items-center justify-center">
                    <p className="text-sm text-slate-400">Loading performance...</p>
                </div>
            ) : records.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-slate-100 bg-white text-center shadow-sm">
                    <p className="text-sm font-medium text-slate-600">No performance data yet</p>
                    <p className="mt-1 text-xs text-slate-400">
                        Your performance metrics will appear here once recorded.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-3">

                    {/* Left: Month Selector */}
                    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 font-semibold text-slate-700">Performance History</h2>
                        <div className="space-y-2">
                            {records.map((record) => {
                                const isCurrent = record.month === currentMonth && record.year === currentYear;
                                const isSelected = selectedRecord?.month === record.month && selectedRecord?.year === record.year;
                                return (
                                    <button
                                        key={`${record.month}-${record.year}`}
                                        onClick={() => setSelectedRecord(record)}
                                        className={`w-full rounded-lg px-4 py-3 text-left transition-all ${
                                            isSelected
                                                ? "bg-slate-900 text-white"
                                                : "border border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-200"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold">
                                                {MONTHS[record.month - 1]} {record.year}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {isCurrent && (
                                                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                        isSelected ? "bg-white/20 text-white" : "bg-violet-100 text-violet-600"
                                                    }`}>
                                                        Current
                                                    </span>
                                                )}
                                                <span className={`text-xs ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                                                    {record.metrics.length} metrics
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Selected Month Metrics */}
                    <div className="lg:col-span-2">
                        {selectedRecord ? (
                            <div className="space-y-4">

                                {/* Period Header */}
                                <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                                                Performance Period
                                            </p>
                                            <h2 className="mt-1 text-2xl font-bold text-slate-800">
                                                {MONTHS[selectedRecord.month - 1]} {selectedRecord.year}
                                            </h2>
                                        </div>
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                                            {selectedRecord.metrics.length} metrics recorded
                                        </span>
                                    </div>
                                </div>

                                {/* Metrics */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {selectedRecord.metrics.map((metric, index) => {
                                        const accents = [
                                            "border-l-violet-500",
                                            "border-l-blue-500",
                                            "border-l-emerald-500",
                                            "border-l-amber-500",
                                        ];
                                        const accent = accents[index % accents.length];
                                        return (
                                            <div
                                                key={metric.id}
                                                className={`rounded-xl border border-slate-100 border-l-4 bg-white p-5 shadow-sm ${accent}`}
                                            >
                                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                    {metric.metric_name}
                                                </p>
                                                <div className="mt-2 flex items-end gap-2">
                                                    <p className="text-4xl font-bold text-slate-800">
                                                        {metric.metric_value.toLocaleString()}
                                                    </p>
                                                    <p className="mb-1 text-sm text-slate-400">
                                                        {metric.metric_unit}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Compare with current month */}
                                {currentRecord &&
                                    selectedRecord.month !== currentMonth &&
                                    selectedRecord.year !== currentYear && (
                                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
                                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            vs Current Month ({MONTHS[currentMonth - 1]} {currentYear})
                                        </p>
                                        <div className="space-y-3">
                                            {selectedRecord.metrics.map((metric) => {
                                                const current = currentRecord.metrics.find(
                                                    (m) => m.metric_name === metric.metric_name
                                                );
                                                if (!current) return null;
                                                const diff = current.metric_value - metric.metric_value;
                                                const isUp = diff >= 0;
                                                return (
                                                    <div key={metric.id} className="flex items-center justify-between">
                                                        <span className="text-sm text-slate-600">{metric.metric_name}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-semibold text-slate-800">
                                                                {current.metric_value.toLocaleString()}
                                                            </span>
                                                            <span className={`text-xs font-semibold ${isUp ? "text-emerald-600" : "text-rose-500"}`}>
                                                                {isUp ? "↑" : "↓"} {Math.abs(diff).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                            </div>
                        ) : (
                            <div className="flex h-40 items-center justify-center rounded-xl border border-slate-100 bg-white">
                                <p className="text-sm text-slate-400">Select a period to view metrics</p>
                            </div>
                        )}
                    </div>

                </div>
            )}

        </DashboardLayout>
    );
};

export default MyPerformance;