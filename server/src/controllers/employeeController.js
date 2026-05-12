const employeeService = require("../services/employeeService");

/*
  Controller handles request/response
*/

const getEmployees = async (req, res) => {
    try {
        const employees =
            await employeeService.getEmployees();

        res.status(200).json(employees);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch employees"
        });
    }
};

const createEmployee = async (req, res) => {
    try {
        /*
          Receive admin form data
        */
        const {
            fullname,
            email,
            password,
            role
        } = req.body;

        await employeeService.createEmployee({
            fullname,
            email,
            password,
            role
        });

        res.status(201).json({
            message: "Employee created"
        });

    } catch (error) {
        res.status(500).json({
            message: "Employee creation failed"
        });
    }
};

module.exports = {
    getEmployees,
    createEmployee
};
