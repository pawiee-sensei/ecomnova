import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import { Link } from "react-router-dom";

const Employees = () => {
    /*
      Stores employee records from backend
    */
    const [employees, setEmployees] = useState([]);

    /*
      Loading state while fetching
    */
    const [loading, setLoading] = useState(true);

    /*
      Fetch workforce directory
    */
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await api.get(
                    "/admin/employees"
                );

                setEmployees(response.data);

            } catch (error) {
                console.error(
                    "Employee fetch failed:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };



        fetchEmployees();
    }, []);

    /*
  Toggle employee account status
*/
    const handleStatusToggle = async (
        employeeId,
        currentStatus
    ) => {
        try {
            const newStatus =
                currentStatus === "active"
                    ? "inactive"
                    : "active";

            await api.patch(
                `/admin/employees/${employeeId}/status`,
                {
                    status: newStatus
                }
            );

            /*
            Update UI instantly
            */
            setEmployees((prevEmployees) =>
                prevEmployees.map((employee) =>
                    employee.id === employeeId
                        ? {
                            ...employee,
                            status: newStatus
                        }
                        : employee
                )
            );

        } catch (error) {
            console.error(
                "Status update failed:",
                error
            );
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <h1>Loading employees...</h1>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>



            {/* Employee table */}
            <div className="border rounded-xl overflow-hidden">

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Workforce Directory
                        </h1>

                        <p className="text-gray-500">
                            Employee account management
                        </p>
                    </div>

                    <Link
                        to="/admin/employees/create"
                        className="bg-black text-white px-5 py-3 rounded-lg"
                    >
                        Create Employee
                    </Link>
                </div>  

                <table className="w-full">

                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-4">
                                Employee ID
                            </th>

                            <th className="text-left p-4">
                                Full Name
                            </th>

                            <th className="text-left p-4">
                                Email
                            </th>

                            <th className="text-left p-4">
                                Role
                            </th>

                            <th className="text-left p-4">
                                Status
                            </th>

                            <th className="text-left p-4">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {employees.map((employee) => (
                            <tr
                                key={employee.id}
                                className="border-t"
                            >
                                <td className="p-4">
                                    {employee.employee_id}
                                </td>

                                <td className="p-4">
                                    {employee.fullname}
                                </td>

                                <td className="p-4">
                                    {employee.email}
                                </td>

                                <td className="p-4 capitalize">
                                    {employee.role}
                                </td>

                                <td className="p-4">
                                    <span
                                        className={`
                                            px-3 py-1 rounded-full text-sm
                                            ${
                                                employee.status === "active"
                                                    ? "bg-green-100"
                                                    : "bg-red-100"
                                            }
                                        `}
                                    >
                                        {employee.status}
                                    </span>
                                </td>

                                <td className="p-4 flex gap-2">

                                    {/* Edit profile */}
                                    <Link
                                        to={`/admin/employees/edit/${employee.id}`}
                                        className="bg-black text-white px-4 py-2 rounded-lg text-sm"
                                    >
                                        Edit
                                    </Link>

                                    {/* Toggle account access */}
                                    <button
                                        onClick={() =>
                                            handleStatusToggle(
                                                employee.id,
                                                employee.status
                                            )
                                        }
                                        className={`
                                            px-4 py-2 rounded-lg text-sm text-white
                                            ${
                                                employee.status === "active"
                                                    ? "bg-red-600"
                                                    : "bg-green-600"
                                            }
                                        `}
                                    >
                                        {employee.status === "active"
                                            ? "Deactivate"
                                            : "Activate"}
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>

        </DashboardLayout>
    );
};

export default Employees;