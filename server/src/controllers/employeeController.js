const employeeService = require("../services/employeeService");

/*
  Controller handles request/response
*/

const getEmployees = async (req, res) => {
    try {
        const { search, role, status } = req.query;

        const employees =
            await employeeService.getEmployees(
                search,
                role,
                status
            );

        res.status(200).json(employees);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch employees"
        });
    }
};

/*
  Create employee account
*/

const createEmployee = async (req, res) => {
    try {
        const {
            fullname,
            email,
            password,
            role
        } = req.body;

        /*
          Create employee
        */
        const result =
            await employeeService.createEmployee({
                fullname,
                email,
                password,
                role
            });

        /*
          Audit log
        */
        await employeeService.createAuditLog({
            actor_id: req.user.id,
            target_user_id: result.insertId,
            action: "EMPLOYEE_CREATED",
            details: "Admin created employee account"
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

        /*
          Audit log
        */
        await employeeService.createAuditLog({
            actor_id: req.user.id,
            target_user_id: req.params.id,
            action: "PROFILE_UPDATED",
            details: "Employee profile updated"
        });

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

        /*
          Audit log
        */
        await employeeService.createAuditLog({
            actor_id: req.user.id,
            target_user_id: req.params.id,
            action: "STATUS_CHANGED",
            details: `Changed status to ${status}`
        });

        res.status(200).json({
            message: "Employee status updated"
        });

    } catch (error) {
        res.status(500).json({
            message: "Status update failed"
        });
    }
};

/*
  Admin resets employee password
*/

const resetEmployeePassword = async (
    req,
    res
) => {
    try {
        const { newPassword } = req.body;

        /*
          Basic validation
        */
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                message:
                    "Password must be at least 6 characters"
            });
        }

        await employeeService.resetEmployeePassword(
            req.params.id,
            newPassword
        );

        /*
          Audit log
        */
        await employeeService.createAuditLog({
            actor_id: req.user.id,
            target_user_id: req.params.id,
            action: "PASSWORD_RESET",
            details: "Admin reset employee password"
        });

        res.status(200).json({
            message: "Password reset successful"
        });

    } catch (error) {
        res.status(500).json({
            message: "Password reset failed"
        });
    }
};

/*
  Fetch audit history
*/

const getAuditLogs = async (
    req,
    res
) => {
    try {
        const logs =
            await employeeService.getAuditLogs();

        res.status(200).json(logs);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch audit logs"
        });
    }
};

/*
  Employee-specific audit logs
*/

const getEmployeeAuditLogs = async (
    req,
    res
) => {
    try {
        const logs =
            await employeeService.getEmployeeAuditLogs(
                req.params.id
            );

        res.status(200).json(logs);

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to fetch employee audit logs"
        });
    }
};

module.exports = {
    getEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployee,
    updateEmployeeStatus,
    resetEmployeePassword,
    getAuditLogs,
    getEmployeeAuditLogs
};