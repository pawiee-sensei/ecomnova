import DashboardLayout from "../../layouts/DashboardLayout";
import { useState, useEffect } from "react";
import api from "../../services/api";
const Attendance = () => {

const [attendance, setAttendance] =
    useState([]);

const [summary, setSummary] =
    useState(null);

const [searchTerm, setSearchTerm] =
    useState("");

const [statusFilter, setStatusFilter] =
    useState("");

const [analytics, setAnalytics] =
    useState([]);

    const fetchAttendance =
    async () => {

        try {

            const response =
                await api.get(
                    "/manager/attendance"
                );

            setAttendance(
                response.data
            );

        } catch (error) {

            console.error(
                "Failed to load attendance:",
                error
            );
        }
    };

    const fetchAnalytics =
    async () => {

        try {

            const response =
                await api.get(
                    "/manager/attendance-analytics"
                );

            setAnalytics(
                response.data
            );

        } catch (error) {

            console.error(
                "Failed to load analytics:",
                error
            );
        }
    };

    const fetchSummary =
    async () => {

        try {

            const response =
                await api.get(
                    "/manager/attendance-summary"
                );

            setSummary(
                response.data
            );

        } catch (error) {

            console.error(
                "Failed to load summary:",
                error
            );
        }
    };

    useEffect(() => {

    fetchAttendance();
    fetchSummary();
    fetchAnalytics();

}, []);

const filteredAttendance =
    attendance.filter(
        (record) => {

            const matchesSearch =
                record.fullname
                    .toLowerCase()
                    .includes(
                        searchTerm.toLowerCase()
                    );

            const matchesStatus =
                !statusFilter ||
                record.status ===
                    statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        }
    );

    const analyticsData =
    analytics.map(
        (employee) => {

            const present =
                Number(
                    employee.presentCount
                );

            const late =
                Number(
                    employee.lateCount
                );

            const absent =
                Number(
                    employee.absentCount
                );

            const leave =
                Number(
                    employee.leaveCount
                );

            const total =
                present +
                late +
                absent +
                leave;

            const attendanceRate =
                total === 0
                    ? 0
                    : Math.round(
                          (
                              present /
                              total
                          ) * 100
                      );

            const score =
                total === 0
                    ? 0
                    : Math.round(
                          (
                              (
                                  present *
                                      100 +
                                  late *
                                      50
                              ) /
                              (total * 100)
                          ) *
                              100
                      );

            let risk =
                "Excellent";

            if (
                score < 75
            ) {

                risk =
                    "Critical";

            } else if (
                score < 85
            ) {

                risk =
                    "Warning";

            } else if (
                score < 95
            ) {

                risk =
                    "Good";
            }

            return {
                ...employee,
                attendanceRate,
                score,
                risk
            };
        }
    );



    return (
        <DashboardLayout>

            <div className="mb-8">

                <h1 className="text-3xl font-bold">
                    Attendance
                </h1>

                <p className="text-gray-500">
                    Monitor team attendance and attendance trends.
                </p>

            </div>

            <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

    <div className="rounded-xl border bg-white p-6">
        <p className="text-sm text-slate-500">
            Present
        </p>

        <h2 className="mt-2 text-3xl font-bold">
            {summary?.presentCount || 0}
        </h2>
    </div>

    <div className="rounded-xl border bg-white p-6">
        <p className="text-sm text-slate-500">
            Late
        </p>

        <h2 className="mt-2 text-3xl font-bold">
            {summary?.lateCount || 0}
        </h2>
    </div>

    <div className="rounded-xl border bg-white p-6">
        <p className="text-sm text-slate-500">
            Absent
        </p>

        <h2 className="mt-2 text-3xl font-bold">
            {summary?.absentCount || 0}
        </h2>
    </div>

    <div className="rounded-xl border bg-white p-6">
        <p className="text-sm text-slate-500">
            Leave
        </p>

        <h2 className="mt-2 text-3xl font-bold">
            {summary?.leaveCount || 0}
        </h2>
    </div>

</div>


<div className="mb-6 flex flex-wrap gap-4">

    <input
        type="text"
        placeholder="Search employee..."
        value={searchTerm}
        onChange={(e) =>
            setSearchTerm(
                e.target.value
            )
        }
        className="rounded-lg border p-3"
    />

    <select
        value={statusFilter}
        onChange={(e) =>
            setStatusFilter(
                e.target.value
            )
        }
        className="rounded-lg border p-3"
    >
        <option value="">
            All Statuses
        </option>

        <option value="present">
            Present
        </option>

        <option value="late">
            Late
        </option>

        <option value="absent">
            Absent
        </option>

        <option value="leave">
            Leave
        </option>

    </select>

</div>

<div className="rounded-xl border bg-white overflow-hidden">

    <table className="w-full">

        <thead className="bg-slate-100">

            <tr>

                <th className="p-4 text-left">
                    Employee
                </th>

                <th className="p-4 text-left">
                    Date
                </th>

                <th className="p-4 text-left">
                    Status
                </th>

            </tr>

        </thead>

        <tbody>

            {filteredAttendance.map(
                (record) => (

                    <tr
                        key={record.id}
                        className="border-t"
                    >

                        <td className="p-4">
                            {record.fullname}
                        </td>

                        <td className="p-4">
                            {record.attendance_date}
                        </td>

                        <td className="p-4 capitalize">
                            {record.status}
                        </td>

                    </tr>
                )
            )}

        </tbody>

    </table>

</div>

<div className="mb-8 rounded-xl border bg-white overflow-hidden">

    <div className="border-b p-4">

        <h2 className="text-xl font-semibold">
            Attendance Analytics
        </h2>

    </div>

    <table className="w-full">

        <thead className="bg-slate-100">

            <tr>

                <th className="p-4 text-left">
                    Employee
                </th>

                <th className="p-4 text-left">
                    Rate
                </th>

                <th className="p-4 text-left">
                    Score
                </th>

                <th className="p-4 text-left">
                    Risk
                </th>

                <th className="p-4 text-left">
                    Breakdown
                </th>

            </tr>

        </thead>

        <tbody>

            {analyticsData.map(
                (employee) => (

                    <tr
                        key={
                            employee.employee_id
                        }
                        className="border-t"
                    >

                        <td className="p-4">
                            {
                                employee.fullname
                            }
                        </td>

                        <td className="p-4">
                            {
                                employee.attendanceRate
                            }%
                        </td>

                        <td className="p-4">
                            {
                                employee.score
                            }
                        </td>

                        <td className="p-4">
                            {
                                employee.risk
                            }
                        </td>

                        <td className="p-4 text-sm">

                            P:
                            {
                                employee.presentCount
                            }

                            {" | "}

                            L:
                            {
                                employee.lateCount
                            }

                            {" | "}

                            A:
                            {
                                employee.absentCount
                            }

                            {" | "}

                            LV:
                            {
                                employee.leaveCount
                            }

                        </td>

                    </tr>
                )
            )}

        </tbody>

    </table>

</div>

        </DashboardLayout>
    );
};

export default Attendance;