import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

const EmployeeDetails = () => {
    /*
      Employee ID from route
    */
    const { id } = useParams();

    /*
      Employee profile state
    */
    const [employee, setEmployee] =
        useState(null);

    /*
      Loading state
    */
    const [loading, setLoading] =
        useState(true);

    /*
    Password reset modal state
    */
    const [showResetForm, setShowResetForm] =
        useState(false);

    /*
    Temporary password input
    */
    const [newPassword, setNewPassword] =
        useState("");

    /*
      Fetch employee profile
    */
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await api.get(
                    `/admin/employees/${id}`
                );

                setEmployee(response.data);

            } catch (error) {
                console.error(
                    "Employee detail fetch failed:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();

        
    }, [id]);

    /*
  Reset employee password
*/
const handlePasswordReset = async () => {
    try {
        await api.patch(
            `/admin/employees/${id}/reset-password`,
            {
                newPassword
            }
        );

        /*
          Close reset form
        */
        setShowResetForm(false);

        setNewPassword("");

        alert("Password reset successful");

    } catch (error) {
        console.error(
            "Password reset failed:",
            error
        );
    }
};

    if (loading) {
        return (
            <DashboardLayout>
                <h1>Loading employee profile...</h1>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>

            {showResetForm && (
    <div className="border rounded-xl p-6 mb-6">

        <h2 className="text-xl font-semibold mb-4">
            Reset Employee Password
        </h2>

        <input
            type="password"
            placeholder="Temporary password"
            value={newPassword}
            onChange={(e) =>
                setNewPassword(
                    e.target.value
                )
            }
            className="w-full border p-4 rounded-lg mb-4"
        />

        <div className="flex gap-3">
            <button
                onClick={handlePasswordReset}
                className="bg-black text-white px-5 py-3 rounded-lg"
            >
                Confirm Reset
            </button>

            <button
                onClick={() =>
                    setShowResetForm(false)
                }
                className="border px-5 py-3 rounded-lg"
            >
                Cancel
            </button>
        </div>

    </div>
)}

            <div className="max-w-3xl">

                <h1 className="text-3xl font-bold mb-8">
                    Employee Profile
                </h1>

                <div className="border rounded-xl p-8 space-y-6">

                    <div>
                        <p className="text-gray-500">
                            Employee ID
                        </p>

                        <p className="text-lg font-medium">
                            {employee.employee_id}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">
                            Full Name
                        </p>

                        <p className="text-lg font-medium">
                            {employee.fullname}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">
                            Email
                        </p>

                        <p className="text-lg font-medium">
                            {employee.email}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">
                            Role
                        </p>

                        <p className="text-lg font-medium capitalize">
                            {employee.role}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">
                            Status
                        </p>

                        <p className="text-lg font-medium capitalize">
                            {employee.status}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">
                            Account Created
                        </p>

                        <p className="text-lg font-medium">
                            {new Date(
                                employee.created_at
                            ).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="flex gap-3 mb-8">

                        {/* Open reset form */}
                        <button
                            onClick={() =>
                                setShowResetForm(true)
                            }
                            className="bg-red-600 text-white px-5 py-3 rounded-lg"
                        >
                            Reset Password
                        </button>

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
};

export default EmployeeDetails;