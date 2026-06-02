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

module.exports = {
    getMyTeam,
    getTeamMember,
    getTeamOverview,
    getTeamActivity
};
