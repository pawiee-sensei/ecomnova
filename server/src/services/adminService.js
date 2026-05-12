const adminModel = require("../models/adminModel");

/*
  Service layer:
  combines dashboard business logic
*/

const getDashboardStats = async () => {
    return new Promise((resolve, reject) => {

        adminModel.getTotalEmployees((err, total) => {
            if (err) return reject(err);

            adminModel.getActiveEmployees((err, active) => {
                if (err) return reject(err);

                adminModel.getTotalDepartments((err, departments) => {
                    if (err) return reject(err);

                    adminModel.getOpenTickets((err, open) => {
                        if (err) return reject(err);

                        adminModel.getEscalatedTickets((err, escalated) => {
                            if (err) return reject(err);

                            adminModel.getResolvedToday((err, resolved) => {
                                if (err) return reject(err);

                                resolve({
                                    totalEmployees:
                                        total[0].totalEmployees,

                                    activeEmployees:
                                        active[0].activeEmployees,

                                    totalDepartments:
                                        departments[0].totalDepartments,

                                    openTickets:
                                        open[0].openTickets,

                                    escalatedTickets:
                                        escalated[0].escalatedTickets,

                                    resolvedToday:
                                        resolved[0].resolvedToday
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

module.exports = {
    getDashboardStats
};