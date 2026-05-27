const loginAttemptModel = require(
    "../models/loginAttemptModel"
);

const db = require("../config/db");

/*
  Create login attempt
*/

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

/*
  Fetch login attempts
*/

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

/*
  Count failed attempts
*/

const countFailedAttemptsByEmail =
    async (email) => {
        return new Promise(
            (resolve, reject) => {
                const sql = `
                    SELECT COUNT(*) AS total
                    FROM login_attempts
                    WHERE email = ?
                    AND status = 'FAILED'
                `;

                db.query(
                    sql,
                    [email],
                    (err, results) => {
                        if (err)
                            return reject(err);

                        resolve(
                            results[0].total
                        );
                    }
                );
            }
        );
    };

    const countFailedAttemptsByUserId =
        async (userId) => {
            return new Promise(
                (resolve, reject) => {
                    const sql = `
                        SELECT COUNT(*) AS total
                        FROM login_attempts
                        WHERE user_id = ?
                        AND status = 'FAILED'
                        AND created_at >=
                            NOW() - INTERVAL 15 MINUTE
                    `;

                    db.query(
                        sql,
                        [userId],
                        (err, results) => {
                            if (err)
                                return reject(err);

                            resolve(
                                results[0].total
                            );
                        }
                    );
                }
            );
        };

    

module.exports = {
    createLoginAttempt,
    getLoginAttempts,
    countFailedAttemptsByEmail,
    countFailedAttemptsByUserId
};