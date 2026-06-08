import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";



const Announcements = () => {

    const [announcements, setAnnouncements] =
    useState([]);

    const [title, setTitle] =
        useState("");

    const [content, setContent] =
        useState("");

    const [status, setStatus] =
        useState("upcoming");

    const [effectiveDate, setEffectiveDate] =
        useState("");

    const [editingId, setEditingId] =
    useState(null);

    const upcoming =
    announcements.filter(
        (a) =>
            a.status === "upcoming"
    );

const active =
    announcements.filter(
        (a) =>
            a.status === "active"
    );

const implemented =
    announcements.filter(
        (a) =>
            a.status === "implemented"
    );

const archived =
    announcements.filter(
        (a) =>
            a.status === "archived"
    );

    const updateAnnouncement =
    async () => {

        try {

            await api.put(
                `/manager/announcements/${editingId}`,
                {
                    title,
                    content,
                    status,
                    effectiveDate
                }
            );

            setEditingId(null);

            setTitle("");
            setContent("");
            setStatus("upcoming");
            setEffectiveDate("");

            fetchAnnouncements();

        } catch (error) {

            console.error(error);
        }
    };

    const archiveAnnouncement =
    async (
        announcementId
    ) => {

        try {

            await api.put(
                `/manager/announcements/${announcementId}/archive`
            );

            fetchAnnouncements();

        } catch (error) {

            console.error(
                "Failed to archive announcement:",
                error
            );
        }
    };

    const fetchAnnouncements =
    async () => {

        try {

            const response =
                await api.get(
                    "/manager/announcements"
                );

            setAnnouncements(
                response.data
            );

        } catch (error) {

            console.error(
                "Failed to load announcements:",
                error
            );
        }
    };


    const createAnnouncement =
    async () => {

        if (
    !title.trim() ||
    !content.trim() ||
    !effectiveDate
) {
    return;
}

        try {

            await api.post(
                "/manager/announcements",
                {
                    title,
                    content,
                    status,
                    effectiveDate
                }
            );

            alert("Announcement created successfully");

            setTitle("");
            setContent("");
            setStatus("upcoming");
            setEffectiveDate("");

            fetchAnnouncements();

        } catch (error) {

            console.error(
                "Failed to create announcement:",
                error
            );
        }
    };

    useEffect(() => {
    fetchAnnouncements();
}, []);

const AnnouncementSection = ({
    title,
    announcements
}) => (
    <div className="rounded-xl border bg-white p-6">

        <h2 className="mb-4 text-xl font-semibold">
            {title}
        </h2>

        {announcements.length === 0 ? (

            <p className="text-slate-500">
                No announcements.
            </p>

        ) : (

            <div className="space-y-4">

                {announcements.map(
                    (
                        announcement
                    ) => (

                        <div
                            key={
                                announcement.id
                            }
                            className="rounded-lg border p-4"
                        >

                            <h3 className="font-semibold">
                                {
                                    announcement.title
                                }
                            </h3>

                            <p className="mt-2 text-sm text-slate-600">
                                {
                                    announcement.content
                                }
                            </p>

                            <p className="mt-2 text-xs text-slate-500">
                                Effective:
                                {" "}
                                {
                                    announcement.effective_date
                                }
                            </p>

                            {announcement.status !== "archived" && (

    <div className="mt-3 flex gap-2">

        <button
            onClick={() => {

                setEditingId(
                    announcement.id
                );

                setTitle(
                    announcement.title
                );

                setContent(
                    announcement.content
                );

                setStatus(
                    announcement.status
                );

                setEffectiveDate(
                    announcement.effective_date
                );

            }}
            className="rounded-lg border px-3 py-1 text-sm hover:bg-slate-50"
        >
            Edit
        </button>

        <button
            onClick={() => {

                const confirmed =
                    window.confirm(
                        "Archive this announcement?"
                    );

                if (confirmed) {

                    archiveAnnouncement(
                        announcement.id
                    );
                }

            }}
            className="rounded-lg border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
        >
            Archive
        </button>

    </div>

)}
                            

                        </div>
                    )
                )}

            </div>

        )}

    </div>
);



    return (
        <DashboardLayout>

            <div className="mb-8">

                <h1 className="text-3xl font-bold">
                    Announcements
                </h1>

                <p className="text-gray-500">
                    Manage team announcements and upcoming changes.
                </p>

            </div>

            <div className="mb-8 rounded-xl border bg-white p-6">

    <h2 className="mb-4 text-xl font-semibold">
        Create Announcement
    </h2>

    <div className="space-y-4">

        <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) =>
                setTitle(e.target.value)
            }
            className="w-full rounded-lg border p-3"
        />

        <textarea
            rows="4"
            placeholder="Announcement details..."
            value={content}
            onChange={(e) =>
                setContent(e.target.value)
            }
            className="w-full rounded-lg border p-3"
        />

        <div className="grid gap-4 md:grid-cols-2">

            <select
                value={status}
                onChange={(e) =>
                    setStatus(
                        e.target.value
                    )
                }
                className="rounded-lg border p-3"
            >
                <option value="upcoming">
                    Upcoming
                </option>

                <option value="active">
                    Active
                </option>

                <option value="implemented">
                    Implemented
                </option>
            </select>

            <input
                type="date"
                value={effectiveDate}
                onChange={(e) =>
                    setEffectiveDate(
                        e.target.value
                    )
                }
                className="rounded-lg border p-3"
            />

        </div>

<button
    onClick={
        editingId
            ? updateAnnouncement
            : createAnnouncement
    }
>
            {
    editingId
        ? "Update Announcement"
        : "Create Announcement"
}
        </button>

    </div>

</div>

<div className="grid gap-6">

    <AnnouncementSection
        title="Upcoming"
        announcements={upcoming}
    />

    <AnnouncementSection
        title="Active"
        announcements={active}
    />

    <AnnouncementSection
        title="Implemented"
        announcements={implemented}
    />

    <AnnouncementSection
        title="Archived"
        announcements={archived}
    />

</div>

        </DashboardLayout>
    );
};

export default Announcements;