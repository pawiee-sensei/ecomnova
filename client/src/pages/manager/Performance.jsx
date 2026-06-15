import DashboardLayout from "../../layouts/DashboardLayout";

const Performance = () => {

    return (
    <DashboardLayout>

        <div className="mb-8">

            <h1 className="text-3xl font-bold">
                Department Performance
            </h1>

            <p className="text-gray-500">
                Monitor department effectiveness, performance trends, risks, and management insights.
            </p>

        </div>

        {/* Executive Overview */}

        <div className="mb-8 grid gap-6 md:grid-cols-4">

            <div className="rounded-xl border bg-white p-6">

                <h3 className="text-sm text-slate-500">
                    Overall Company Performance
                </h3>

                <p className="mt-2 text-3xl font-bold">
                    0%
                </p>

            </div>

            <div className="rounded-xl border bg-white p-6">

                <h3 className="text-sm text-slate-500">
                    Best Department
                </h3>

                <p className="mt-2 text-3xl font-bold">
                    -
                </p>

            </div>

            <div className="rounded-xl border bg-white p-6">

                <h3 className="text-sm text-slate-500">
                    Lowest Department
                </h3>

                <p className="mt-2 text-3xl font-bold">
                    -
                </p>

            </div>

            <div className="rounded-xl border bg-white p-6">

                <h3 className="text-sm text-slate-500">
                    Departments Evaluated
                </h3>

                <p className="mt-2 text-3xl font-bold">
                    0
                </p>

            </div>

        </div>

        {/* Department Ranking */}

        <div className="mb-8 rounded-xl border bg-white p-6">

            <h2 className="mb-4 text-xl font-semibold">
                Department Performance Ranking
            </h2>

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead>

                        <tr className="border-b">

                            <th className="p-3 text-left">
                                Department
                            </th>

                            <th className="p-3 text-left">
                                KPI Achievement
                            </th>

                            <th className="p-3 text-left">
                                Attendance
                            </th>

                            <th className="p-3 text-left">
                                Manager Rating
                            </th>

                            <th className="p-3 text-left">
                                Performance Score
                            </th>

                            <th className="p-3 text-left">
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td
                                colSpan="6"
                                className="p-6 text-center text-slate-500"
                            >
                                Department performance data will appear here.
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

        {/* Performance Alerts */}

        <div className="mb-8 rounded-xl border bg-white p-6">

            <h2 className="mb-4 text-xl font-semibold">
                Performance Alerts
            </h2>

            <div className="rounded-lg border border-slate-200 p-4">

                <p className="text-slate-500">
                    Performance alerts and department risks will appear here.
                </p>

            </div>

        </div>

        {/* Department Insights */}

        <div className="rounded-xl border bg-white p-6">

            <h2 className="mb-4 text-xl font-semibold">
                Department Insights
            </h2>

            <div className="rounded-lg border border-slate-200 p-4">

                <p className="text-slate-500">
                    Root cause analysis and management recommendations will appear here.
                </p>

            </div>

        </div>

    </DashboardLayout>
);
};

export default Performance;