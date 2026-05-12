
//middleware to check user role
const authorizeRoles = (...roles) => {
    return (req,res, next) => {

        //check if user is authenticated
        if (!req.user) {
            return res.status(401).json({
                message: "Access denied"
            });
        }
        
        //check if user role is in allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        next();
    };
};

module.exports = authorizeRoles;