const auditLogModel = require(
    "../models/auditLogModel"
);

const createAuditLog = async (
    auditData
) => {
    return new Promise((resolve, reject) => {
        auditLogModel.createAuditLog(
            auditData,
            (err, result) => {
                if (err) return reject(err);

                resolve(result);
            }
        );
    });
};

const getAuditLogs = async () => {
    return new Promise((resolve, reject) => {
        auditLogModel.getAuditLogs(
            (err, results) => {
                if (err) return reject(err);

                resolve(results);
            }
        );
    });
};

module.exports = {
    createAuditLog,
    getAuditLogs
};