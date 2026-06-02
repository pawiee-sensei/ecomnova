const managerModel = require(
    "../models/managerModel"
);

const getManagerTeam =
    async (managerId) => {
        return new Promise(
            (resolve, reject) => {
                managerModel.getManagerTeam(
                    managerId,
                    (err, results) => {
                        if (err) {
                            return reject(err);
                        }

                        resolve(results);
                    }
                );
            }
        );
    };

module.exports = {
    getManagerTeam
};