import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const Departments = () => {
    /*
      Department directory
    */
    const [departments, setDepartments] =
        useState([]);

    /*
      Create form state
    */
    const [formData, setFormData] =
        useState({
            name: "",
            code: "",
            description: "",
            head_id: "",
            status: "active"
        });

    /*
      Fetch departments
    */
    const fetchDepartments = async () => {
        try {
            const response = await api.get(
                "/admin/departments"
            );

            setDepartments(response.data);

        } catch (error) {
            console.error(
                "Department fetch failed:",
                error
            );
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    /*
      Form updates
    */
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value
        });
    };

    /*
      Create department
    */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post(
                "/admin/departments",
                formData
            );

            /*
              Refresh directory
            */
            fetchDepartments();

            /*
              Reset form
            */
            setFormData({
                name: "",
                code: "",
                description: "",
                head_id: "",
                status: "active"
            });

        } catch (error) {
            console.error(
                "Department creation failed:",
                error
            );
        }
    };

    return (
        <DashboardLayout>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Department Management
                </h1>

                <p className="text-gray-500">
                    Organizational structure governance
                </p>
            </div>

            {/* Create Department */}
            <div className="border rounded-xl p-6 mb-10">
                <h2 className="text-xl font-semibold mb-4">
                    Create Department
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <input
                        type="text"
                        name="name"
                        placeholder="Department Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-lg"
                        required
                    />

                    <input
                        type="text"
                        name="code"
                        placeholder="Department Code"
                        value={formData.code}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-lg"
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-lg"
                    />

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-lg"
                    >
                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>

                        <option value="archived">
                            Archived
                        </option>
                    </select>

                    <button
                        className="bg-black text-white px-6 py-3 rounded-lg"
                    >
                        Create Department
                    </button>
                </form>
            </div>

            {/* Department Directory */}
            <div className="border rounded-xl overflow-hidden">
                <table className="w-full">

                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-4">
                                Name
                            </th>

                            <th className="text-left p-4">
                                Code
                            </th>

                            <th className="text-left p-4">
                                Head
                            </th>

                            <th className="text-left p-4">
                                Status
                            </th>

                            <th className="text-left p-4">
                                Created
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {departments.map(
                            (department) => (
                                <tr
                                    key={
                                        department.id
                                    }
                                    className="border-t"
                                >
                                    <td className="p-4">
                                        {
                                            department.name
                                        }
                                    </td>

                                    <td className="p-4">
                                        {department.code ||
                                            "—"}
                                    </td>

                                    <td className="p-4">
                                        {department.head_name ||
                                            "Unassigned"}
                                    </td>

                                    <td className="p-4 capitalize">
                                        {
                                            department.status
                                        }
                                    </td>

                                    <td className="p-4">
                                        {new Date(
                                            department.created_at
                                        ).toLocaleDateString()}
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

export default Departments;