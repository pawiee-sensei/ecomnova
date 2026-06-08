const managerService = require(
    "../services/managerService"
);

const getMyTeam =
    async (req, res) => {
        try {

            const managerId =
                req.user.id;

            const employees =
                await managerService.getManagerTeam(
                    managerId
                );

            res.status(200).json(
                employees
            );

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to load team members"
            });
        }
    };

    const getTeamMember =
    async (
        req,
        res
    ) => {

        try {

            const employeeId =
                req.params.id;

            const managerId =
                req.user.id;

            const employee =
                await managerService.getTeamMemberById(
                    employeeId,
                    managerId
                );

            if (
                !employee
            ) {
                return res
                    .status(404)
                    .json({
                        message:
                            "Employee not found"
                    });
            }

            res.json(
                employee
            );

        } catch (
            error
        ) {

            console.error(
                error
            );

            res
                .status(500)
                .json({
                    message:
                        "Failed to fetch employee"
                });
        }
    };

    const getTeamOverview =
    async (req, res) => {

        try {

            const overview =
                await managerService.getTeamOverview(
                    req.user.id
                );

            res.json(
                overview
            );

        } catch (error) {

            console.error(
                error
            );

            res.status(500).json({
                message:
                    "Failed to load team overview"
            });
        }
    };

    const getTeamActivity =
    async (req, res) => {

        try {

            const activity =
                await managerService.getTeamActivity(
                    req.user.id
                );

            res.json(
                activity
            );

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to load team activity"
            });
        }
    };

    const createCoachingNote =
    async (req, res) => {

        try {

            const {
                employeeId,
                note
            } = req.body;

            await managerService.createCoachingNote(
                employeeId,
                req.user.id,
                note
            );

            res.status(201).json({
                message:
                    "Coaching note created"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    error.message
            });
        }
    };

const getCoachingNotes =
    async (req, res) => {

        try {

            const notes =
                await managerService.getCoachingNotes(
                    req.params.employeeId,
                    req.user.id
                );

            res.json(notes);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    error.message
            });
        }
    };

    const createAnnouncement =
    async (req, res) => {

        try {

            const {
                title,
                content,
                status,
                effectiveDate
            } = req.body;

            await managerService.createAnnouncement(
                title,
                content,
                status,
                effectiveDate,
                req.user.id
            );

            res.status(201).json({
                message:
                    "Announcement created"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to create announcement"
            });
        }
    };

const getAnnouncements =
    async (req, res) => {

        try {

            const announcements =
                await managerService.getAnnouncements(
                    req.user.id
                );

            res.json(
                announcements
            );

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to load announcements"
            });
        }
    };

    const archiveAnnouncement =
    async (req, res) => {

        try {

            await managerService.archiveAnnouncement(
                req.params.id,
                req.user.id
            );

            res.json({
                message:
                    "Announcement archived"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to archive announcement"
            });
        }
    };

    const updateAnnouncement =
    async (req, res) => {

        try {

            const {
                title,
                content,
                status,
                effectiveDate
            } = req.body;

            await managerService.updateAnnouncement(
                req.params.id,
                req.user.id,
                title,
                content,
                status,
                effectiveDate
            );

            res.json({
                message:
                    "Announcement updated"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to update announcement"
            });
        }
    };

module.exports = {
    getMyTeam,
    getTeamMember,
    getTeamOverview,
    getTeamActivity,
    createCoachingNote,
    getCoachingNotes,
    createAnnouncement,
    getAnnouncements,
    archiveAnnouncement,
    updateAnnouncement
};
