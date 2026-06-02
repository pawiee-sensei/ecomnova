const managerModel = require(
    "../models/managerModel"
);

const getManagerTeam =
    async (managerId) => {
        return new Promise(
            (resolve, reject) => {
                managerModel.getManagerTeam(
                    managerId,
                    (err, results) => {
                        if (err) {
                            return reject(err);
                        }

                        resolve(results);
                    }
                );
            }
        );
    };

    const getTeamMemberById =
    async (
        employeeId,
        managerId
    ) => {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                managerModel.getTeamMemberById(
                    employeeId,
                    managerId,
                    (
                        err,
                        results
                    ) => {

                        if (err) {
                            return reject(
                                err
                            );
                        }

                        resolve(
                            results[0]
                        );
                    }
                );
            }
        );
    };

    const getTeamOverview =
    async (managerId) => {

        return new Promise(
            (resolve, reject) => {

                managerModel.getTeamOverview(
                    managerId,
                    (err, results) => {

                        if (err) {
                            return reject(err);
                        }

                        resolve(
                            results[0]
                        );
                    }
                );
            }
        );
    };

const getTeamActivity =
    async (managerId) => {

        return new Promise(
            (resolve, reject) => {

                managerModel.getTeamActivity(
                    managerId,
                    (err, results) => {

                        if (err) {
                            return reject(err);
                        }

                        resolve(results);
                    }
                );
            }
        );
    };

module.exports = {
    getManagerTeam,
    getTeamMemberById,
    getTeamOverview,
    getTeamActivity
};