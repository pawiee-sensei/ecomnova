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

    const [notes, setNotes] =
        useState([]);

    const [newNote, setNewNote] =
        useState("");
    
    const [category, setCategory] =
    useState("performance");

    const [categoryFilter, setCategoryFilter] =
    useState("all");

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

    const fetchCoachingNotes =
    async () => {

        try {

            const response =
                await api.get(
                    `/manager/coaching-notes/${id}`
                );

            setNotes(
                response.data
            );

        } catch (error) {

            console.error(
                "Failed to load coaching notes:",
                error
            );
        }
    };

    const createNote =
    async () => {

        if (
            !newNote.trim()
        ) {
            return;
        }

        try {

            await api.post(
                "/manager/coaching-notes",
                {
                    employeeId: id,
                    category,
                    note: newNote
                }
            );

            setNewNote("");

            setCategory("performance");

            fetchCoachingNotes();

        } catch (error) {

            console.error(
                "Failed to create note:",
                error
            );
        }
    };



    useEffect(() => {
        fetchEmployee();
        fetchCoachingNotes();
    }, [id]);
    

    const filteredNotes =
    categoryFilter === "all"
        ? notes
        : notes.filter(
              (note) =>
                  note.category ===
                  categoryFilter
          );
    

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

            <div className="mt-8 rounded-xl border bg-white p-6">

    <h2 className="text-xl font-semibold">
        Coaching Notes
    </h2>

    <div className="mt-4">

        <textarea
            rows="4"
            value={newNote}
            onChange={(e) =>
                setNewNote(
                    e.target.value
                )
            }
            placeholder="Write a coaching note..."
            className="w-full rounded-lg border p-3"
        />

        
        <select
    value={category}
    onChange={(e) =>
        setCategory(
            e.target.value
        )
    }
    className="mb-3 w-full rounded-lg border p-3"
>
    <option value="performance">
        Performance
    </option>

    <option value="training">
        Training
    </option>

    <option value="attendance">
        Attendance
    </option>

    <option value="leadership">
        Leadership
    </option>

    <option value="recognition">
        Recognition
    </option>

    <option value="behavior">
        Behavior
    </option>
</select>

        <button
            onClick={createNote}
            className="mt-3 rounded-lg bg-slate-950 px-4 py-2 text-white"
        >
            Add Note
        </button>

        <div className="mt-6">

    <label className="mb-2 block text-sm font-medium">
        Filter Notes
    </label>

    <select
        value={categoryFilter}
        onChange={(e) =>
            setCategoryFilter(
                e.target.value
            )
        }
        className="w-full rounded-lg border p-3"
    >
        <option value="all">
            All Categories
        </option>

        <option value="performance">
            Performance
        </option>

        <option value="training">
            Training
        </option>

        <option value="attendance">
            Attendance
        </option>

        <option value="leadership">
            Leadership
        </option>

        <option value="recognition">
            Recognition
        </option>

        <option value="behavior">
            Behavior
        </option>
    </select>

</div>



    </div>

    

    <div className="mt-8 space-y-4">

        {notes.length === 0 ? (

            <p className="text-sm text-slate-500">
                No coaching notes yet.
            </p>

        ) : (

            filteredNotes.map(
                (note) => (

                    <div
                        key={note.id}
                        className="rounded-lg border border-slate-200 p-4"
                    >

                        <div className="flex items-center justify-between">

                            <div>

<div className="flex items-center gap-2">

    <p className="font-medium">
        {note.manager_name}
    </p>

    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs capitalize">
        {note.category}
    </span>

</div>

                                <p className="text-sm text-slate-500">
                                    {new Date(
                                        note.created_at
                                    ).toLocaleDateString()}
                                </p>

                            </div>

                        </div>

                        <p className="mt-3 text-slate-700">
                            {note.note}
                        </p>

                    </div>
                )
            )

        )}

    </div>

</div>

        </DashboardLayout>
    );
};

export default EmployeeProfile;