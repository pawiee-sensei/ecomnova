import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

const EditEmployee = () => {
    /*
      Get employee id from URL
      Example: /edit/3
    */
    const { id } = useParams();

    const navigate = useNavigate();

    /*
      Form state
      Prefilled from backend
    */
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        role: ""
    });

    /*
      Loading employee data
    */
    const [loading, setLoading] = useState(true);

    /*
      Fetch selected employee
    */
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await api.get(
                    `/admin/employees/${id}`
                );

                setFormData({
                    fullname: response.data.fullname || "",
                    email: response.data.email || "",
                    role: response.data.role || ""
                });

            } catch (error) {
                console.error(
                    "Employee fetch failed:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id]);

    /*
      Input updates
    */
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    /*
      Submit update
    */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.put(
                `/admin/employees/${id}`,
                formData
            );

            /*
              Return to employee list
            */
            navigate("/admin/employees");

        } catch (error) {
            console.error(
                "Update failed:",
                error
            );
        }
    };

    /*
      Loading fallback
    */
    if (loading) {
        return (
            <DashboardLayout>
                <h1>Loading employee...</h1>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>

            <div className="max-w-xl">
                <h1 className="text-3xl font-bold mb-2">
                    Edit Employee
                </h1>

                <p className="text-gray-500 mb-8">
                    Update employee profile
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    {/* Full name */}
                    <input
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-lg"
                        required
                    />

                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-lg"
                        required
                    />

                    {/* Role update */}
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-lg"
                    >
                        <option value="agent">Agent</option>
                        <option value="leader">Team Leader</option>
                        <option value="manager">Manager</option>
                        <option value="hr">HR</option>
                        <option value="qa">QA</option>
                        <option value="admin">Admin</option>
                    </select>

                    {/* Submit */}
                    <button
                        className="bg-black text-white px-6 py-4 rounded-lg"
                    >
                        Update Employee
                    </button>
                </form>
            </div>

        </DashboardLayout>
    );
};

export default EditEmployee;