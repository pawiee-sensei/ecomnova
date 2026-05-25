import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import api from "../../../services/api";

const jobTitleOptions = [
    "Customer Support Agent",
    "QA Analyst"
];

const employmentTypeOptions = [
    "Full-time",
    "Part-time",
    "Contract",
    "Probation"
];

const workLocationOptions = [
    "Las Piñas Site",
    "Remote"
];

const shiftOptions = [
    "Night Shift",
    "Day Shift"
];

const CreateEmployee = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        role: "agent",
        job_title: "",
        employment_type: "",
        hire_date: "",
        work_location: "",
        shift: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await api.post(
                "/hr/employees",
                formData
            );

            navigate("/hr/employees");

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
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-medium text-slate-500">
                            New Employee
                        </p>

                        <h1 className="mt-1 text-3xl font-bold text-slate-950">
                            Create Employee
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Add a workforce account and assign initial access.
                        </p>
                    </div>

                    <Link
                        to="/hr/employees"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                        Back to Directory
                    </Link>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                    <div className="border-b border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-950">
                            Account Details
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Use a valid email and temporary password for first access.
                        </p>
                    </div>

                    <div className="grid gap-5 p-6 md:grid-cols-2">
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">
                                Full Name
                            </span>

                            <input
                                type="text"
                                name="fullname"
                                placeholder="Jane Smith"
                                value={formData.fullname}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                                required
                            />
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">
                                Email Address
                            </span>

                            <input
                                type="email"
                                name="email"
                                placeholder="jane@ecomnova.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                                required
                            />
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">
                                Temporary Password
                            </span>

                            <input
                                type="password"
                                name="password"
                                placeholder="Minimum 6 characters"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                                required
                            />
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">
                                Role
                            </span>

                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            >
                                <option value="agent">Agent</option>
                                <option value="leader">Team Leader</option>
                                <option value="manager">Manager</option>
                                <option value="hr">HR</option>
                                <option value="qa">QA</option>
                            </select>
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">
                                Job Title
                            </span>

                            <select
                                name="job_title"
                                value={formData.job_title}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            >
                                <option value="">Select job title</option>
                                {jobTitleOptions.map((jobTitle) => (
                                    <option key={jobTitle} value={jobTitle}>
                                        {jobTitle}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">
                                Employment Type
                            </span>

                            <select
                                name="employment_type"
                                value={formData.employment_type}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            >
                                <option value="">Select employment type</option>
                                {employmentTypeOptions.map((employmentType) => (
                                    <option key={employmentType} value={employmentType}>
                                        {employmentType}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">
                                Hire Date
                            </span>

                            <input
                                type="date"
                                name="hire_date"
                                value={formData.hire_date}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            />
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">
                                Work Location
                            </span>

                            <select
                                name="work_location"
                                value={formData.work_location}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            >
                                <option value="">Select work location</option>
                                {workLocationOptions.map((workLocation) => (
                                    <option key={workLocation} value={workLocation}>
                                        {workLocation}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">
                                Shift
                            </span>

                            <select
                                name="shift"
                                value={formData.shift}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            >
                                <option value="">Select shift</option>
                                {shiftOptions.map((shift) => (
                                    <option key={shift} value={shift}>
                                        {shift}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-6 sm:flex-row sm:justify-end">
                        <Link
                            to="/hr/employees"
                            className="inline-flex justify-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex justify-center rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Creating..."
                                : "Create Employee"}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default CreateEmployee;


