const systemDashboardModel = require(
    "../models/systemDashboardModel"
);

const getDashboardMetrics =
    async () => {
        return new Promise(
            (resolve, reject) => {
                systemDashboardModel.getDashboardMetrics(
                    (err, results) => {
                        if (err) {
                            return reject(err);
                        }

                        resolve(
                            results[0]
                        );
                    }
                );
            }
        );
    };

module.exports = {
    getDashboardMetrics
};