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

module.exports = {
    getDepartments,
    createDepartment
};