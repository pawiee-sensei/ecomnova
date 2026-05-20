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
    await validateEmployeeAssignment(id, data);

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

const getTeamById = async (id) => {
    return new Promise((resolve, reject) => {
        employeeModel.getTeamById(
            id,
            (err, results) => {
                if (err) return reject(err);

                resolve(results[0]);
            }
        );
    });
};

const getManagerById = async (id) => {
    return new Promise((resolve, reject) => {
        employeeModel.getManagerById(
            id,
            (err, results) => {
                if (err) return reject(err);

                resolve(results[0]);
            }
        );
    });
};

const createValidationError = (message) => {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
};

const validateEmployeeAssignment = async (
    employeeId,
    data
) => {
    const departmentId = data.department_id
        ? String(data.department_id)
        : "";
    const teamId = data.team_id
        ? String(data.team_id)
        : "";
    const managerId = data.manager_id
        ? String(data.manager_id)
        : "";

    if (teamId && !departmentId) {
        throw createValidationError(
            "Select a department before assigning a team"
        );
    }

    if (managerId && !departmentId) {
        throw createValidationError(
            "Select a department before assigning a manager"
        );
    }

    if (managerId && String(employeeId) === managerId) {
        throw createValidationError(
            "An employee cannot report to themselves"
        );
    }

    if (teamId) {
        const team = await getTeamById(teamId);

        if (!team) {
            throw createValidationError("Selected team does not exist");
        }

        if (String(team.department_id || "") !== departmentId) {
            throw createValidationError(
                "Selected team does not belong to this department"
            );
        }
    }

    if (managerId) {
        const manager = await getManagerById(managerId);

        if (!manager) {
            throw createValidationError(
                "Selected manager does not exist"
            );
        }

        if (String(manager.department_id || "") !== departmentId) {
            throw createValidationError(
                "Selected manager does not belong to this department"
            );
        }
    }
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

/*
  Admin password reset
*/

const resetEmployeePassword = async (
    id,
    newPassword
) => {
    return new Promise(async (resolve, reject) => {

        /*
          Hash new password
        */
        const hashedPassword =
            await bcrypt.hash(newPassword, 10);

        employeeModel.resetEmployeePassword(
            id,
            hashedPassword,
            (err, result) => {
                if (err) return reject(err);

                resolve(result);
            }
        );
    });
};

/*
  Audit logger
*/

const createAuditLog = async (
    auditData
) => {
    return new Promise((resolve, reject) => {
        employeeModel.createAuditLog(
            auditData,
            (err, result) => {
                if (err) return reject(err);

                resolve(result);
            }
        );
    });
};

/*
  Fetch audit logs
*/

const getAuditLogs = async () => {
    return new Promise((resolve, reject) => {
        employeeModel.getAuditLogs(
            (err, results) => {
                if (err) return reject(err);

                resolve(results);
            }
        );
    });
};
/*
  Fetch one employee audit history
*/

const getEmployeeAuditLogs = async (
    employeeId
) => {
    return new Promise((resolve, reject) => {
        employeeModel.getEmployeeAuditLogs(
            employeeId,
            (err, results) => {
                if (err) return reject(err);

                resolve(results);
            }
        );
    });
};

const getDepartments = async () => {
    return new Promise((resolve, reject) => {
        employeeModel.getDepartments(
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });
};

const getTeams = async () => {
    return new Promise((resolve, reject) => {
        employeeModel.getTeams(
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });
};

const getManagers = async () => {
    return new Promise((resolve, reject) => {
        employeeModel.getManagers(
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });
};

module.exports = {
    getEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployee,
    updateEmployeeStatus,
    resetEmployeePassword,
    createAuditLog,
    getAuditLogs,
    getEmployeeAuditLogs,
    getDepartments,
    getTeams,
    getManagers
};
