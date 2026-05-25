const jwt = require("jsonwebtoken");
const db = require("../config/db");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "No token"
        });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
            message: "Authorization header must be Bearer token"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const sql = `
            SELECT
                id,
                fullname,
                email,
                role,
                status,
                security_status
            FROM users
            WHERE id = ?
        `;

        db.query(sql, [decoded.id], (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: "Authentication check failed"
                });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    message: "User no longer exists"
                });
            }

            const user = results[0];

            if (user.status !== "active") {
                return res.status(403).json({
                    message:
                        "Account access restricted. Contact administrator."
                });
            }

            if (user.security_status === "locked") {
                return res.status(403).json({
                    message:
                        "Account locked. Contact system administrator."
                });
            }

            req.user = {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                role: user.role
            };

            next();
        });
    } catch (error) {
        return res.status(403).json({
            message: "Invalid token"
        });
    }
};

module.exports = verifyToken;
