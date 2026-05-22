const teamModel = require(
    "../models/teamModel"
);

const getTeams = async () => {
    return new Promise((resolve, reject) => {
        teamModel.getTeams(
            (err, results) => {
                if (err) return reject(err);

                resolve(results);
            }
        );
    });
};

const createTeam = async (
    teamData
) => {
    return new Promise((resolve, reject) => {
        teamModel.createTeam(
            teamData,
            (err, result) => {
                if (err) return reject(err);

                resolve(result);
            }
        );
    });
};

const getDepartments = async () => {
    return new Promise((resolve, reject) => {
        teamModel.getDepartments(
            (err, results) => {
                if (err) return reject(err);

                resolve(results);
            }
        );
    });
};

const getTeamLeaders = async () => {
    return new Promise((resolve, reject) => {
        teamModel.getTeamLeaders(
            (err, results) => {
                if (err) return reject(err);

                resolve(results);
            }
        );
    });
};

const getTeamById = async (
    id
) => {
    return new Promise((resolve, reject) => {
        teamModel.getTeamById(
            id,
            (err, results) => {
                if (err) return reject(err);

                resolve(results[0]);
            }
        );
    });
};

const updateTeam = async (
    id,
    teamData
) => {
    return new Promise((resolve, reject) => {
        teamModel.updateTeam(
            id,
            teamData,
            (err, result) => {
                if (err) return reject(err);

                resolve(result);
            }
        );
    });
};

const getTeamMembers = async (
    teamId
) => {
    return new Promise((resolve, reject) => {
        teamModel.getTeamMembers(
            teamId,
            (err, results) => {
                if (err) return reject(err);

                resolve(results);
            }
        );
    });
};

const getAvailableEmployees = async () => {
    return new Promise((resolve, reject) => {
        teamModel.getAvailableEmployees(
            (err, results) => {
                if (err) return reject(err);

                resolve(results);
            }
        );
    });
};

const assignMembersToTeam = async (
    teamId,
    employeeIds
) => {
    return new Promise((resolve, reject) => {
        teamModel.assignMembersToTeam(
            teamId,
            employeeIds,
            (err, result) => {
                if (err) return reject(err);

                resolve(result);
            }
        );
    });
};

const removeMemberFromTeam = async (
    employeeId
) => {
    return new Promise((resolve, reject) => {
        teamModel.removeMemberFromTeam(
            employeeId,
            (err, result) => {
                if (err) return reject(err);

                resolve(result);
            }
        );
    });
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