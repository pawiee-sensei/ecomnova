const performanceService =
    require("../services/performanceService");

const getDepartmentPerformance =
    async (
        req,
        res
    ) => {

        try {

            const departments =
                await performanceService.getDepartmentPerformance();

            res.json(
                departments
            );

        } catch (
            error
        ) {

            console.error(
                error
            );

            res.status(500).json({
                message:
                    "Failed to load department performance"
            });
        }
    };

const getDepartmentPerformanceHistory =
    async (
        req,
        res
    ) => {

        try {

            const departmentId = req.query.departmentId || 1;

const history =
    await performanceService.getDepartmentPerformanceHistory(
        departmentId
    );

            res.json(
                history
            );

        } catch (
            error
        ) {

            console.error(
                error
            );

            res.status(500).json({
                message:
                    "Failed to load performance history"
            });
        }
    };

    const getInsights = async (req, res) => {

    try {

        const insights =
            await performanceService.getInsights();

        res.json(insights);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to load insights"
        });
    }
};

const getAlerts = async (req, res) => {

    try {

        const alerts =
            await performanceService.getAlerts();

        res.json(alerts);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to load alerts"
        });
    }
};

    

module.exports = {
    getDepartmentPerformance,
    getDepartmentPerformanceHistory,
    getInsights,
    getAlerts
};  