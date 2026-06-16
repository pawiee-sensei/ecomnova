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

const history =
    await performanceService.getDepartmentPerformanceHistory(
        3
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

    

module.exports = {
    getDepartmentPerformance,
    getDepartmentPerformanceHistory
};  