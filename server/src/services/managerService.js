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
        category,
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
                            category,
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

    const createAnnouncement =
    async (
        title,
        content,
        status,
        effectiveDate,
        managerId
    ) => {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                managerModel.createAnnouncement(
                    title,
                    content,
                    status,
                    effectiveDate,
                    managerId,
                    (
                        err,
                        result
                    ) => {

                        if (err) {
                            return reject(err);
                        }

                        resolve(result);
                    }
                );
            }
        );
    };

const getAnnouncements =
    async (managerId) => {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                managerModel.getAnnouncements(
                    managerId,
                    (
                        err,
                        results
                    ) => {

                        if (err) {
                            return reject(err);
                        }

                        resolve(results);
                    }
                );
            }
        );
    };

    const archiveAnnouncement =
    async (
        announcementId,
        managerId
    ) => {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                managerModel.archiveAnnouncement(
                    announcementId,
                    managerId,
                    (
                        err,
                        result
                    ) => {

                        if (err) {
                            return reject(err);
                        }

                        resolve(result);
                    }
                );
            }
        );
    };

    const updateAnnouncement =
    async (
        announcementId,
        managerId,
        title,
        content,
        status,
        effectiveDate
    ) => {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                managerModel.updateAnnouncement(
                    announcementId,
                    managerId,
                    title,
                    content,
                    status,
                    effectiveDate,
                    (
                        err,
                        result
                    ) => {

                        if (err) {
                            return reject(err);
                        }

                        resolve(result);
                    }
                );
            }
        );
    };

    const createAttendanceRecord =
    async (
        employeeId,
        attendanceDate,
        status
    ) => {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                managerModel.createAttendanceRecord(
                    employeeId,
                    attendanceDate,
                    status,
                    (
                        err,
                        result
                    ) => {

                        if (err) {
                            return reject(err);
                        }

                        resolve(result);
                    }
                );
            }
        );
    };

    const getTeamAttendance =
    async (managerId) => {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                managerModel.getTeamAttendance(
                    managerId,
                    (
                        err,
                        results
                    ) => {

                        if (err) {
                            return reject(err);
                        }

                        resolve(results);
                    }
                );
            }
        );
    };

    const getAttendanceSummary =
    async (managerId) => {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                managerModel.getAttendanceSummary(
                    managerId,
                    (
                        err,
                        results
                    ) => {

                        if (err) {
                            return reject(err);
                        }

                        resolve(results[0]);
                    }
                );
            }
        );
    };

    const getAttendanceAnalytics =
    async (managerId) => {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                managerModel.getAttendanceAnalytics(
                    managerId,
                    (
                        err,
                        results
                    ) => {

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
    getTeamActivity,
    createCoachingNote,
    getCoachingNotes,
    createAnnouncement,
    getAnnouncements,
    archiveAnnouncement,
    updateAnnouncement,
    createAttendanceRecord,
    getTeamAttendance,
    getAttendanceSummary,
    getAttendanceAnalytics
};