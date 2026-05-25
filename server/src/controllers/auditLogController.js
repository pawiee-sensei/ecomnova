const auditLogService = require(
    "../services/auditLogService"
);

const getAuditLogs = async (
    req,
    res
) => {
    try {
        const logs =
            await auditLogService.getAuditLogs();

        res.status(200).json(logs);

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to fetch audit logs"
        });
    }
};

module.exports = {
    getAuditLogs
};