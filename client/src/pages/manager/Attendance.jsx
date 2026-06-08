import DashboardLayout from "../../layouts/DashboardLayout";
import { useState, useEffect } from "react";
import api from "../../services/api";
const Attendance = () => {

const [attendance, setAttendance] =
    useState([]);

const [summary, setSummary] =
    useState(null);

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

}, []);




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

            {attendance.map(
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

        </DashboardLayout>
    );
};

export default Attendance;