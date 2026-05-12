import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

const CreateEmployee = () => {
    const navigate = useNavigate();

    /*
      Form state
      Controlled inputs
    */
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        role: "agent"
    });

    /*
      Prevent double submit
    */
    const [loading, setLoading] = useState(false);

    /*
      Update input values
    */
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    /*
      Submit employee creation
    */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await api.post(
                "/admin/employees",
                formData
            );

            /*
              Redirect back to workforce directory
            */
            navigate("/admin/employees");

        } catch (error) {
            console.error(
                "Employee creation failed:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>

            <div className="max-w-xl">
                <h1 className="text-3xl font-bold mb-2">
                    Create Employee
                </h1>

                <p className="text-gray-500 mb-8">
                    Create workforce account access
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    {/* Full name */}
                    <input
                        type="text"
                        name="fullname"
                        placeholder="Full name"
                        value={formData.fullname}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-lg"
                        required
                    />

                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-lg"
                        required
                    />

                    {/* Password */}
                    <input
                        type="password"
                        name="password"
                        placeholder="Temporary password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-lg"
                        required
                    />

                    {/* Role assignment */}
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-lg"
                    >
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
                    </select>

                    {/* Submit */}
                    <button
                        disabled={loading}
                        className="bg-black text-white px-6 py-4 rounded-lg"
                    >
                        {loading
                            ? "Creating..."
                            : "Create Employee"}
                    </button>
                </form>
            </div>

        </DashboardLayout>
    );
};

export default CreateEmployee;