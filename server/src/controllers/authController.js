const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//models for auth controller functions 
const {createUser, findUserByEmail} = require("../models/authModel");

const auditLogService = require("../services/auditLogService");
const systemUserService = require("../services/systemUserService");
const loginAttemptService = require("../services/loginAttemptService");
const securitySettingsService = require("../services/securitySettingsService");

//register user 
const register = async (req, res) => {

    try {
        const { fullname, email, password, } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({
                message:
                    "Full name, email, and password are required"
            });
        }

        const securitySettings =
            await securitySettingsService.getSecuritySettings();

        if (
            password.length <
            securitySettings.password_min_length
        ) {
            return res.status(400).json({
                message: `Password must be at least ${securitySettings.password_min_length} characters`
            });
        }

        //check if email already exists
        findUserByEmail(email, async (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }
            
            if (result.length > 0) {
                return res.status(400).json({
                    message: "Email already exists"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const role = "agent";
            
        createUser (fullname, email, hashedPassword, role, (err, result) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    res.status(201).json({
                        message: "User registered"
                    });
                }
            );
        });

    } catch (error) {
        res.status(500).json(error);
    }
};

const login = (req, res) => {

    const { email, password } = req.body || {};

    

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    findUserByEmail(email, async (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            await loginAttemptService.createLoginAttempt({
                email,
                status: "FAILED",
                reason: "User not found"
            });

            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = result[0];
        const securitySettings =
            await securitySettingsService.getSecuritySettings();

                /*
        Only active employees can authenticate
        */
        if (user.status !== "active") {
            await loginAttemptService.createLoginAttempt({
                user_id: user.id,
                email,
                status: "BLOCKED",
                reason: "Employment status restricted"
            });

            return res.status(403).json({
                message:
                    "Account access restricted. Contact administrator."
            });
        }

        if (user.security_status === "locked") {
            await loginAttemptService.createLoginAttempt({
                user_id: user.id,
                email,
                status: "BLOCKED",
                reason: "Account locked"
            });

            return res.status(403).json({
                message:
                    "Account locked. Contact system administrator."
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            await loginAttemptService.createLoginAttempt({
                user_id: user.id,
                email,
                status: "FAILED",
                reason: "Wrong password"
            });

            const failedAttempts =
                await loginAttemptService.countFailedAttemptsByUserId(
                    user.id,
                    securitySettings.failed_attempt_window_minutes
                );
                

            if (
                securitySettings.auto_lock_enabled &&
                failedAttempts >=
                    securitySettings.failed_attempt_threshold
            ) {
                await systemUserService.updateSecurityStatus(
                    user.id,
                    "locked"
                );

                await loginAttemptService.createLoginAttempt({
                    user_id: user.id,
                    email,
                    status: "BLOCKED",
                    reason:
                        "Auto-locked after repeated failed login attempts"
                });

                await auditLogService.createAuditLog({
                    actor_id: user.id,
                    target_user_id: user.id,
                    action: "AUTO_LOCK_ACCOUNT",
                    module: "SECURITY",
                    details: `System auto-locked account after ${securitySettings.failed_attempt_threshold} failed login attempts within ${securitySettings.failed_attempt_window_minutes} minutes`
                });

                return res.status(403).json({
                    message: `Account locked after ${securitySettings.failed_attempt_threshold} failed login attempts within ${securitySettings.failed_attempt_window_minutes} minutes.`
                });
            }

            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                tokenVersion: user.token_version
            },
            process.env.JWT_SECRET,
            {
                expiresIn:
                securitySettings.jwt_expiration
            }
        );

        await loginAttemptService.createLoginAttempt({
            user_id: user.id,
            email,
            status: "SUCCESS",
            reason: "Login successful"
        });

        res.json({
            token,
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                role: user.role
            }
        });
    });
};

module.exports = {
    register,
    login
};
