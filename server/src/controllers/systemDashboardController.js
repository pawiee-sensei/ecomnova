const systemDashboardService = require(
    "../services/systemDashboardService"
);

const getDashboardMetrics =
    async (req, res) => {
        try {
            const metrics =
                await systemDashboardService.getDashboardMetrics();

            res.status(200).json(
                metrics
            );

        } catch (error) {
            res.status(500).json({
                message:
                    "Failed to load dashboard metrics"
            });
        }
    };

module.exports = {
    getDashboardMetrics
};