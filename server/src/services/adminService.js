const adminModel = require("../models/adminModel");

/*
  Service layer = business logic
  Combines multiple model calls
*/

const getDashboardStats = async () => {
    return new Promise((resolve, reject) => {

        adminModel.getTotalEmployees((err, totalResult) => {
            if (err) return reject(err);

            adminModel.getActiveEmployees((err, activeResult) => {
                if (err) return reject(err);

                resolve({
                    totalEmployees:
                        totalResult[0].totalEmployees,

                    activeEmployees:
                        activeResult[0].activeEmployees
                });
            });
        });
    });
};

module.exports = {
    getDashboardStats
};