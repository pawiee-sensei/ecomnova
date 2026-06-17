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

    const getDepartmentPerformanceHistory =
    async (
        departmentId
    ) => {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                performanceModel.getDepartmentPerformanceHistory(

                    departmentId,

                    (
                        err,
                        results
                    ) => {

                        if (err) {
                            return reject(
                                err
                            );
                        }

                        resolve(
                            results
                        );
                    }
                );
            }
        );
    };

    const getInsights = async () => {

    return new Promise((resolve, reject) => {

        performanceModel.getDepartmentPerformance(
            (err, results) => {

                if (err) {
                    return reject(err);
                }

                const target = Number(results[0]?.target_value) || 0;
                const actual = Number(results[0]?.actual_value) || 0;

                const achievement =
                    target === 0
                        ? 0
                        : Math.round((actual / target) * 100);

                const attendance =
                    results[0]?.attendance_score === null
                        ? 100
                        : Number(results[0]?.attendance_score);

                const managerRating =
                    (Number(results[0]?.rating) || 0) * 10;

                const performanceScore = Math.round(
                    achievement * 0.60 +
                    attendance * 0.20 +
                    managerRating * 0.20
                );

                // Determine primary issue
                let primaryIssue = null;
                let finding = null;
                let impact = null;
                let recommendation = null;

                if (attendance < 75) {
                    primaryIssue = "Attendance";
                    finding = `Attendance is ${attendance}%, below the target of 75%.`;
                    impact = "Low attendance is reducing department productivity.";
                    recommendation = "Review attendance trends and conduct coaching sessions with affected employees.";

                } else if (achievement < 60) {
                    primaryIssue = "KPI Achievement";
                    finding = `KPI achievement is ${achievement}%, below the target of 60%.`;
                    impact = "Low KPI achievement is affecting overall department performance.";
                    recommendation = "Identify skill gaps and provide targeted training to improve output.";

                } else if (managerRating < 60) {
                    primaryIssue = "Manager Rating";
                    finding = `Manager rating is ${managerRating}, below the threshold of 60.`;
                    impact = "Low manager rating may indicate team dissatisfaction or leadership gaps.";
                    recommendation = "Schedule a leadership review and gather team feedback.";

                } else {
                    primaryIssue = null;
                    finding = "All metrics are within acceptable ranges.";
                    impact = null;
                    recommendation = "Continue current strategies and monitor monthly.";
                }

                resolve({
                    departmentScore: performanceScore,
                    primaryIssue,
                    finding,
                    impact,
                    recommendation
                });
            }
        );
    });
};

module.exports = {
    getDepartmentPerformance,
    getDepartmentPerformanceHistory,
    getInsights
};