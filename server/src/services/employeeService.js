const employeeModel = require("../models/employeeModel");

/*
  Service layer
  Business logic goes here
*/

const getEmployees = async () => {
    return new Promise((resolve, reject) => {
        employeeModel.getAllEmployees((err, results) => {
            if (err) return reject(err);

            resolve(results);
        });
    });
};

module.exports = {
    getEmployees
};