const teamService = require(
    "../services/teamService"
);

const getTeams = async (
    req,
    res
) => {
    try {
        const teams =
            await teamService.getTeams();

        res.status(200).json(teams);

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to fetch teams"
        });
    }
};

const createTeam = async (
    req,
    res
) => {
    try {
        await teamService.createTeam(
            req.body
        );

        res.status(201).json({
            message:
                "Team created successfully"
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Team creation failed"
        });
    }
};

module.exports = {
    getTeams,
    createTeam
};