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

module.exports = {
    getManagerTeam,
    getTeamMemberById
};