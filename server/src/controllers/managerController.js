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

module.exports = {
    getMyTeam
};