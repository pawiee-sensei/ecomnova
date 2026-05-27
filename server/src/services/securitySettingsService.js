const securitySettingsModel = require(
    "../models/securitySettingsModel"
);

const getSecuritySettings = async () => {
    return new Promise((resolve, reject) => {
        securitySettingsModel.getSecuritySettings(
            (err, results) => {
                if (err) return reject(err);

                resolve(results[0]);
            }
        );
    });
};

const updateSecuritySettings =
    async (settings) => {
        return new Promise(
            (resolve, reject) => {
                securitySettingsModel.updateSecuritySettings(
                    settings,
                    (err, result) => {
                        if (err)
                            return reject(err);

                        resolve(result);
                    }
                );
            }
        );
    };

module.exports = {
    getSecuritySettings,
    updateSecuritySettings
};