const loginAttemptModel = require(
    "../models/loginAttemptModel"
);

const createLoginAttempt = async (
    loginData
) => {
    return new Promise((resolve, reject) => {
        loginAttemptModel.createLoginAttempt(
            loginData,
            (err, result) => {
                if (err) return reject(err);

                resolve(result);
            }
        );
    });
};

const getLoginAttempts = async () => {
    return new Promise((resolve, reject) => {
        loginAttemptModel.getLoginAttempts(
            (err, results) => {
                if (err) return reject(err);

                resolve(results);
            }
        );
    });
};

module.exports = {
    createLoginAttempt,
    getLoginAttempts
};