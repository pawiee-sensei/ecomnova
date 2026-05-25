const systemUserModel = require(
    "../models/systemUserModel"
);

const getSystemUsers = async () => {
    return new Promise((resolve, reject) => {
        systemUserModel.getSystemUsers(
            (err, results) => {
                if (err) return reject(err);

                resolve(results);
            }
        );
    });
};

const updateUserRole = async (
    userId,
    role
) => {
    return new Promise((resolve, reject) => {
        systemUserModel.updateUserRole(
            userId,
            role,
            (err, result) => {
                if (err) return reject(err);

                resolve(result);
            }
        );
    });
};

const updateSecurityStatus = async (
    userId,
    securityStatus
) => {
    return new Promise((resolve, reject) => {
        systemUserModel.updateSecurityStatus(
            userId,
            securityStatus,
            (err, result) => {
                if (err) return reject(err);

                resolve(result);
            }
        );
    });
};

module.exports = {
    getSystemUsers,
    updateUserRole,
    updateSecurityStatus
};