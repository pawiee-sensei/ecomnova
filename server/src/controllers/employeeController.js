const employeeService = require("../services/employeeService");

/*
  Controller handles request/response
*/

const getEmployees = async (req, res) => {
    try {
        const { search, role, status } = req.query;

        const employees =
            await employeeService.getEmployees(search, role, status);

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

/*
  Fetch one employee
*/

const getEmployeeById = async (
    req,
    res
) => {
    try {
        const employee =
            await employeeService.getEmployeeById(
                req.params.id
            );

        res.status(200).json(employee);

    } catch (error) {
        res.status(500).json({
            message: "Employee fetch failed"
        });
    }
};

/*
  Update employee profile
*/

const updateEmployee = async (
    req,
    res
) => {
    try {
        await employeeService.updateEmployee(
            req.params.id,
            req.body
        );

        res.status(200).json({
            message: "Employee updated"
        });

    } catch (error) {
        res.status(500).json({
            message: "Update failed"
        });
    }
};

/*
  Change employee access status
*/

/*
  Change employee account status
*/

const updateEmployeeStatus = async (
    req,
    res
) => {
    try {
        const { status } = req.body;

        /*
          Allowed enterprise statuses
        */
        const allowedStatuses = [
            "active",
            "inactive",
            "suspended",
            "terminated"
        ];

        /*
          Prevent invalid updates
        */
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        await employeeService.updateEmployeeStatus(
            req.params.id,
            status
        );

        res.status(200).json({
            message: "Employee status updated"
        });

    } catch (error) {
        res.status(500).json({
            message: "Status update failed"
        });
    }
};

module.exports = {
    getEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployee,
    updateEmployeeStatus
};
