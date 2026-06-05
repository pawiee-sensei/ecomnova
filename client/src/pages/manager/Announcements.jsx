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
            onClick={createAnnouncement}
            className="rounded-lg bg-slate-950 px-4 py-2 text-white"
        >
            Create Announcement
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

</div>

        </DashboardLayout>
    );
};

export default Announcements;