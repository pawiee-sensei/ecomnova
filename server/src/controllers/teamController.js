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

const getDepartments = async (
    req,
    res
) => {
    try {
        const departments =
            await teamService.getDepartments();

        res.status(200).json(departments);

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to fetch departments"
        });
    }
};

const getTeamLeaders = async (
    req,
    res
) => {
    try {
        const leaders =
            await teamService.getTeamLeaders();

        res.status(200).json(leaders);

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to fetch team leaders"
        });
    }
};

const getTeamById = async (
    req,
    res
) => {
    try {
        const team =
            await teamService.getTeamById(
                req.params.id
            );

        res.status(200).json(team);

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to fetch team"
        });
    }
};

const updateTeam = async (
    req,
    res
) => {
    try {
        await teamService.updateTeam(
            req.params.id,
            req.body
        );

        res.status(200).json({
            message:
                "Team updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Team update failed"
        });
    }
};

const getTeamMembers = async (
    req,
    res
) => {
    try {
        const members =
            await teamService.getTeamMembers(
                req.params.id
            );

        res.status(200).json(members);

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to fetch team members"
        });
    }
};

const getAvailableEmployees = async (
    req,
    res
) => {
    try {
        const employees =
            await teamService.getAvailableEmployees();

        res.status(200).json(employees);

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to fetch employees"
        });
    }
};

const assignMembersToTeam = async (
    req,
    res
) => {
    try {
        const { employeeIds } = req.body;

        await teamService.assignMembersToTeam(
            req.params.id,
            employeeIds
        );

        res.status(200).json({
            message:
                "Members assigned successfully"
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Assignment failed"
        });
    }
};

const removeMemberFromTeam = async (
    req,
    res
) => {
    try {
        await teamService.removeMemberFromTeam(
            req.params.employeeId
        );

        res.status(200).json({
            message:
                "Member removed successfully"
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Removal failed"
        });
    }
};

module.exports = {
    getTeams,
    createTeam,
    getDepartments,
    getTeamLeaders,
    getTeamById,
    updateTeam,
    getTeamMembers,
    getAvailableEmployees,
    assignMembersToTeam,
    removeMemberFromTeam
};