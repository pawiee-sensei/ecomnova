const departmentModel = require(
    "../models/departmentModel"
);

/*
  Fetch all departments
*/

const getDepartments = async () => {
    return new Promise((resolve, reject) => {
        departmentModel.getDepartments(
            (err, results) => {
                if (err) return reject(err);

                resolve(results);
            }
        );
    });
};

/*
  Create department
*/

const createDepartment = async (
    departmentData
) => {
    await validateDepartmentHead(
        departmentData.head_id
    );

    return new Promise((resolve, reject) => {
        departmentModel.createDepartment(
            departmentData,
            (err, result) => {
                if (err) return reject(err);

                resolve(result);
            }
        );
    });
};

const getDepartmentById = async (
    id
) => {
    return new Promise((resolve, reject) => {
        departmentModel.getDepartmentById(
            id,
            (err, results) => {
                if (err) return reject(err);

                resolve(results[0]);
            }
        );
    });
};

const updateDepartment = async (
    id,
    departmentData
) => {
    await validateDepartmentHead(
        departmentData.head_id,
        id
    );

    return new Promise((resolve, reject) => {
        departmentModel.updateDepartment(
            id,
            departmentData,
            (err, result) => {
                if (err) return reject(err);

                resolve(result);
            }
        );
    });
};

const createValidationError = (message) => {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
};

const getDepartmentHeadAssignment = async (
    headId,
    excludedDepartmentId
) => {
    return new Promise((resolve, reject) => {
        departmentModel.getDepartmentHeadAssignment(
            headId,
            excludedDepartmentId,
            (err, results) => {
                if (err) return reject(err);

                resolve(results[0]);
            }
        );
    });
};

const getDepartmentHeadCandidate = async (headId) => {
    return new Promise((resolve, reject) => {
        departmentModel.getDepartmentHeadCandidate(
            headId,
            (err, results) => {
                if (err) return reject(err);

                resolve(results[0]);
            }
        );
    });
};

const validateDepartmentHead = async (
    headId,
    excludedDepartmentId
) => {
    if (!headId) {
        return;
    }

    const candidate =
        await getDepartmentHeadCandidate(headId);

    if (!candidate) {
        throw createValidationError(
            "Selected department head must be a manager, HR, or super admin"
        );
    }

    const assignedDepartment =
        await getDepartmentHeadAssignment(
            headId,
            excludedDepartmentId
        );

    if (assignedDepartment) {
        throw createValidationError(
            `Selected department head already leads ${assignedDepartment.name}`
        );
    }
};

const getDepartmentHeads = async () => {
    return new Promise((resolve, reject) => {
        departmentModel.getDepartmentHeads(
            (err, results) => {
                if (err) return reject(err);

                resolve(results);
            }
        );
    });
};

const getDepartmentMembers = async (
    departmentId
) => {
    return new Promise((resolve, reject) => {
        departmentModel.getDepartmentMembers(
            departmentId,
            (err, results) => {
                if (err) return reject(err);

                resolve(results);
            }
        );
    });
};


module.exports = {
    getDepartments,
    createDepartment,
    getDepartmentById,
    updateDepartment,
    getDepartmentHeads,
    getDepartmentMembers
};
