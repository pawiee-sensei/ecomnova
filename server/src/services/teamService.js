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

module.exports = {
    getTeams,
    createTeam,
    getDepartments,
    getTeamLeaders
};