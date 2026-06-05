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

    const createCoachingNote =
    async (
        employeeId,
        managerId,
        note
    ) => {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                managerModel.validateManagedEmployee(
                    employeeId,
                    managerId,
                    (
                        err,
                        employee
                    ) => {

                        if (err) {
                            return reject(err);
                        }

                        if (
                            employee.length === 0
                        ) {
                            return reject(
                                new Error(
                                    "Unauthorized employee"
                                )
                            );
                        }

                        managerModel.createCoachingNote(
                            employeeId,
                            managerId,
                            note,
                            (
                                err,
                                result
                            ) => {

                                if (err) {
                                    return reject(
                                        err
                                    );
                                }

                                resolve(
                                    result
                                );
                            }
                        );
                    }
                );
            }
        );
    };

const getCoachingNotes =
    async (
        employeeId,
        managerId
    ) => {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                managerModel.validateManagedEmployee(
                    employeeId,
                    managerId,
                    (
                        err,
                        employee
                    ) => {

                        if (err) {
                            return reject(err);
                        }

                        if (
                            employee.length === 0
                        ) {
                            return reject(
                                new Error(
                                    "Unauthorized employee"
                                )
                            );
                        }

                        managerModel.getCoachingNotes(
                            employeeId,
                            (
                                err,
                                notes
                            ) => {

                                if (err) {
                                    return reject(
                                        err
                                    );
                                }

                                resolve(
                                    notes
                                );
                            }
                        );
                    }
                );
            }
        );
    };

module.exports = {
    getManagerTeam,
    getTeamMemberById,
    getTeamOverview,
    getTeamActivity,
    createCoachingNote,
    getCoachingNotes
};