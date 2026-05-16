const employeeModel = require("../models/employeeModel");
const bcrypt = require("bcryptjs");

/*
  Service layer
  Business logic goes here
*/

const getEmployees = async (search, role, status) => {
    return new Promise((resolve, reject) => {
        employeeModel.getAllEmployees(
            search,
            role,
            status,
            (err, results) => {
                if (err) return reject(err);

                resolve(results);
            }
        );
    });
};

const createEmployee = async (data) => {
    return new Promise(async (resolve, reject) => {

        /*
          Hash password
          Never store plain passwords
        */
        const hashedPassword =
            await bcrypt.hash(data.password, 10);

        /*
          Generate employee ID
          Example: EMP-1005
        */
        const employeeId =
            `EMP-${Date.now()}`;

        const employeeData = {
            employee_id: employeeId,
            fullname: data.fullname,
            email: data.email,
            password: hashedPassword,
            role: data.role,
            status: "active"
        };

        employeeModel.createEmployee(
            employeeData,
            (err, result) => {
                if (err) return reject(err);

                resolve(result);
            }
        );
    });
};

/*
  Fetch single employee
*/

const getEmployeeById = async (id) => {
    return new Promise((resolve, reject) => {
        employeeModel.getEmployeeById(
            id,
            (err, results) => {
                if (err) return reject(err);

                resolve(results[0]);
            }
        );
    });
};

/*
  Update profile
*/

const updateEmployee = async (
    id,
    data
) => {
    return new Promise((resolve, reject) => {
        employeeModel.updateEmployee(
            id,
            data,
            (err, result) => {
                if (err) return reject(err);

                resolve(result);
            }
        );
    });
};

/*
  Toggle employee account access
*/

const updateEmployeeStatus = async (
    id,
    status
) => {
    return new Promise((resolve, reject) => {
        employeeModel.updateEmployeeStatus(
            id,
            status,
            (err, result) => {
                if (err) return reject(err);

                resolve(result);
            }
        );
    });
};

module.exports = {
    getEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployee,
    updateEmployeeStatus
};
