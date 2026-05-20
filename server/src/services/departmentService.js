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

module.exports = {
    getDepartments,
    createDepartment,
    getDepartmentById,
    updateDepartment,
    getDepartmentHeads
};