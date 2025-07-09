export const checkRole = (...allowedRoles) => { // Renamed parameter for clarity
    return (req, res, next) => {
        if (!req.user || !req.user.role) { // Add a check for user and role existence
            return res.status(403).json({ error: "Access denied. User role not defined." });
        }
        if (!allowedRoles.includes(req.user.role)) { // Changed userType to role
            return res.status(403).json({ error: "Access denied. You do not have permission to perform this action." });
        }
        next();
    };
};