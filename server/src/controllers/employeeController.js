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

module.exports = {
    getEmployees
};