const adminService = require("../services/adminService");

const getDashboardStats = async (req, res) => {
    try {
        const stats =
            await adminService.getDashboardStats();

        res.status(200).json(stats);

    } catch (error) {
        console.log("Dashboard Error:", error);

        res.status(500).json({
            message: "Dashboard fetch failed",
            error
        });
    }
};

module.exports = {
    getDashboardStats
};