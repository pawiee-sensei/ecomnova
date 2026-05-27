const securitySettingsService = require(
    "../services/securitySettingsService"
);

const getSecuritySettings =
    async (req, res) => {
        try {
            const settings =
                await securitySettingsService.getSecuritySettings();

            res.status(200).json(settings);

        } catch (error) {
            res.status(500).json({
                message:
                    "Failed to fetch security settings"
            });
        }
    };

const updateSecuritySettings =
    async (req, res) => {
        try {
            await securitySettingsService.updateSecuritySettings(
                req.body
            );

            res.status(200).json({
                message:
                    "Security settings updated"
            });

        } catch (error) {
            res.status(500).json({
                message:
                    "Failed to update security settings"
            });
        }
    };

module.exports = {
    getSecuritySettings,
    updateSecuritySettings
};