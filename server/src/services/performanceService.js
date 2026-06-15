const performanceModel =
    require("../models/performanceModel");

const getDepartmentPerformance =
    async () => {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                performanceModel.getDepartmentPerformance(
                    (
                        err,
                        results
                    ) => {

                        if (err) {
                            return reject(err);
                        }

                        const performance =
    results.map(
        (
            department
        ) => {

            const target =
                Number(
                    department.target_value
                );

            const actual =
                Number(
                    department.actual_value
                );

            const achievement =
                target === 0
                    ? 0
                    : Math.round(
                        (
                            actual /
                            target
                        ) * 100
                    );

            const attendance =
                department.attendance_score === null
                    ? 100
                    : Number(
                        department.attendance_score
                    );

            const managerRating =
                (
                    Number(
                        department.rating
                    ) || 0
                ) * 10;

            const performanceScore =
                Math.round(

                    achievement * 0.60 +

                    attendance * 0.20 +

                    managerRating * 0.20
                );

            let status =
                "Excellent";

            if (
                performanceScore < 60
            ) {

                status =
                    "Critical";

            } else if (
                performanceScore < 75
            ) {

                status =
                    "Warning";

            } else if (
                performanceScore < 90
            ) {

                status =
                    "Good";
            }

            return {

                ...department,

                achievement,

                attendance,

                managerRating,

                performanceScore,

                status
            };
        }
    );

resolve(
    performance
);
                    }
                );
            }
        );
    };

module.exports = {
    getDepartmentPerformance
};