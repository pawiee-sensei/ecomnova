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
    Search keyword
    */
    const [search, setSearch] = useState("");

    /*
    Role filter
    */
    const [roleFilter, setRoleFilter] = useState("");

    /*
    Status filter
    */
    const [statusFilter, setStatusFilter] = useState("");

    /*
      Fetch workforce directory
    */
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await api.get(
                    `/admin/employees?search=${search}&role=${roleFilter}&status=${statusFilter}`
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
    }, [search, roleFilter, statusFilter]);

    /*
  Toggle employee account status
*/
 /*
  Change employee account status
*/
    const handleStatusChange = async (
        employeeId,
        newStatus
    ) => {
        try {
            await api.patch(
                `/admin/employees/${employeeId}/status`,
                {
                    status: newStatus
                }
            );

            /*
            Instant UI refresh
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

<div className="mb-6 flex gap-4 flex-wrap">

    {/* Search */}
    <input
        type="text"
        placeholder="Search employee..."
        value={search}
        onChange={(e) =>
            setSearch(e.target.value)
        }
        className="border p-4 rounded-lg w-full max-w-md"
    />

    {/* Role filter */}
    <select
        value={roleFilter}
        onChange={(e) =>
            setRoleFilter(e.target.value)
        }
        className="border p-4 rounded-lg"
    >
        <option value="">
            All Roles
        </option>

        <option value="agent">
            Agent
        </option>

        <option value="leader">
            Team Leader
        </option>

        <option value="manager">
            Manager
        </option>

        <option value="hr">
            HR
        </option>

        <option value="qa">
            QA
        </option>

        <option value="admin">
            Admin
        </option>
    </select>

    {/* Status filter */}
    <select
        value={statusFilter}
        onChange={(e) =>
            setStatusFilter(e.target.value)
        }
        className="border p-4 rounded-lg"
    >
        <option value="">
            All Statuses
        </option>

        <option value="active">
            Active
        </option>

        <option value="inactive">
            Inactive
        </option>

        <option value="suspended">
            Suspended
        </option>

        <option value="terminated">
            Terminated
        </option>
    </select>

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
                                                    : employee.status === "inactive"
                                                    ? "bg-gray-200"
                                                    : employee.status === "suspended"
                                                    ? "bg-yellow-100"
                                                    : "bg-red-100"
                                            }
                                        `}
                                    >
                                        {employee.status}
                                    </span>
                                </td>

                                <td className="p-4 flex gap-2 items-center">

                                    {/* Edit employee */}
                                    <Link
                                        to={`/admin/employees/edit/${employee.id}`}
                                        className="bg-black text-white px-4 py-2 rounded-lg text-sm"
                                    >
                                        Edit
                                    </Link>

                                    {/* Enterprise status dropdown */}
                                    <select
                                        value={employee.status}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                employee.id,
                                                e.target.value
                                            )
                                        }
                                        className="border px-3 py-2 rounded-lg text-sm"
                                    >
                                        <option value="active">
                                            Active
                                        </option>

                                        <option value="inactive">
                                            Inactive
                                        </option>

                                        <option value="suspended">
                                            Suspended
                                        </option>

                                        <option value="terminated">
                                            Terminated
                                        </option>
                                    </select>

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