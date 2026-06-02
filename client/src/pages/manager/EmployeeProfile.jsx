import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const EmployeeProfile = () => {

    const { id } = useParams();

    const [employee, setEmployee] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const fetchEmployee =
        async () => {

            try {

                const response =
                    await api.get(
                        `/manager/team/${id}`
                    );

                setEmployee(
                    response.data
                );

            } catch (error) {

                console.error(
                    "Failed to load employee:",
                    error
                );

            } finally {

                setLoading(false);
            }
        };

    useEffect(() => {
        fetchEmployee();
    }, [id]);

    if (loading) {
        return (
            <DashboardLayout>
                Loading employee...
            </DashboardLayout>
        );
    }

    if (!employee) {
        return (
            <DashboardLayout>
                Employee not found.
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Employee Profile
                </h1>

                <p className="text-gray-500">
                    Team member details
                </p>
            </div>

            <div className="rounded-xl border bg-white p-6">

                <div className="grid gap-6 md:grid-cols-2">

                    <div>
                        <p className="text-sm text-gray-500">
                            Employee ID
                        </p>

                        <p className="font-medium">
                            {employee.employee_id}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Full Name
                        </p>

                        <p className="font-medium">
                            {employee.fullname}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Email
                        </p>

                        <p className="font-medium">
                            {employee.email}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Role
                        </p>

                        <p className="font-medium capitalize">
                            {employee.role}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Status
                        </p>

                        <p className="font-medium capitalize">
                            {employee.status}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Job Title
                        </p>

                        <p className="font-medium">
                            {employee.job_title}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Employment Type
                        </p>

                        <p className="font-medium">
                            {employee.employment_type}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Hire Date
                        </p>

                        <p className="font-medium">
                            {employee.hire_date}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Work Location
                        </p>

                        <p className="font-medium">
                            {employee.work_location}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Shift
                        </p>

                        <p className="font-medium">
                            {employee.shift}
                        </p>
                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
};

export default EmployeeProfile;