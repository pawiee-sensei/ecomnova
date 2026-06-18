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

const getKPIs = async (req, res) => {
    try {
        const managerId = req.user.id;
        const data = await performanceService.getKPIs(managerId);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load KPIs" });
    }
};

const setKPI = async (req, res) => {
    try {
        const managerId = req.user.id;
        const { month, year, targetValue } = req.body;
        await performanceService.setKPI(managerId, month, year, targetValue);
        res.json({ message: "KPI target set successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to set KPI" });
    }
};

const updateActualValue = async (req, res) => {
    try {
        const managerId = req.user.id;
        const { id } = req.params;
        const { actualValue } = req.body;
        await performanceService.updateActualValue(managerId, id, actualValue);
        res.json({ message: "Actual value updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

    

module.exports = {
    getDepartmentPerformance,
    getDepartmentPerformanceHistory,
    getInsights,
    getAlerts,
    getKPIs,
    setKPI,
    updateActualValue
};