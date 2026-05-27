const loginAttemptService = require(
    "../services/loginAttemptService"
);

const getLoginAttempts = async (
    req,
    res
) => {
    try {
        const attempts =
            await loginAttemptService.getLoginAttempts();

        res.status(200).json(attempts);

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to fetch login attempts"
        });
    }
};

module.exports = {
    getLoginAttempts
};