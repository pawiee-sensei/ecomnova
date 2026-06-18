import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const Reports = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [downloading, setDownloading] = useState(null);

    const downloadCSV = async (type) => {
        try {
            setDownloading(type);

            let url = `/manager/reports/${type}`;
            if (type === "attendance" && startDate && endDate) {
                url += `?startDate=${startDate}&endDate=${endDate}`;
            }

            const response = await api.get(url, { responseType: "blob" });

            const blob = new Blob([response.data], { type: "text/csv" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${type}-report.csv`;
            link.click();
            URL.revokeObjectURL(link.href);

        } catch (error) {
            console.error(error);
        } finally {
            setDownloading(null);
        }
    };

    const reports = [
        {
            type: "attendance",
            title: "Attendance Report",
            description: "Export all team attendance records including present, late, absent, and leave entries.",
            icon: "📋",
            color: "border-violet-100",
            iconBg: "bg-violet-50",
            btnColor: "bg-violet-600 hover:bg-violet-700",
            hasDateFilter: true,
        },
        {
            type: "leave",
            title: "Leave Report",
            description: "Export all leave requests with status, dates, reasons, and manager notes.",
            icon: "🗓️",
            color: "border-emerald-100",
            iconBg: "bg-emerald-50",
            btnColor: "bg-emerald-600 hover:bg-emerald-700",
            hasDateFilter: false,
        },
        {
            type: "performance",
            title: "Performance Report",
            description: "Export team attendance analytics including present counts, rates, and risk indicators.",
            icon: "📊",
            color: "border-amber-100",
            iconBg: "bg-amber-50",
            btnColor: "bg-amber-600 hover:bg-amber-700",
            hasDateFilter: false,
        },
    ];

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Manager Dashboard
                    </p>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Reports
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Export team data as CSV files for further analysis.
                    </p>
                </div>
            </div>

            {/* Report Cards */}
            <div className="grid gap-6 lg:grid-cols-3">
                {reports.map((report) => (
                    <div
                        key={report.type}
                        className={`rounded-xl border-2 bg-white p-6 shadow-sm ${report.color}`}
                    >
                        {/* Icon + Title */}
                        <div className="mb-4 flex items-start gap-4">
                            <div className={`rounded-xl p-3 text-2xl ${report.iconBg}`}>
                                {report.icon}
                            </div>
                            <div>
                                <h2 className="font-semibold text-slate-800">
                                    {report.title}
                                </h2>
                                <p className="mt-1 text-xs text-slate-400">
                                    CSV format
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="mb-5 text-sm text-slate-500">
                            {report.description}
                        </p>

                        {/* Date filter for attendance */}
                        {report.hasDateFilter && (
                            <div className="mb-4 space-y-2">
                                <p className="text-xs font-semibold text-slate-400">
                                    Filter by date range (optional)
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="mb-1 block text-xs text-slate-400">
                                            From
                                        </label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-slate-400 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs text-slate-400">
                                            To
                                        </label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-slate-400 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Export Button */}
                        <button
                            onClick={() => downloadCSV(report.type)}
                            disabled={downloading === report.type}
                            className={`w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-50 ${report.btnColor}`}
                        >
                            {downloading === report.type
                                ? "Downloading..."
                                : "⬇ Export CSV"}
                        </button>
                    </div>
                ))}
            </div>

            {/* Info Note */}
            <div className="mt-8 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs text-slate-400">
                    💡 CSV files can be opened directly in Microsoft Excel or Google Sheets. 
                    All exports are based on your team's current data.
                </p>
            </div>
        </DashboardLayout>
    );
};

export default Reports;