export const checkRole = (...allowedRole) => {
    return (req, res, next) => {
        if (!allowedRole.includes(req.user.userType)) {
            return res.status(403).json({ error: "Access denied. You do not have permission to perform this action."})
        }
        next()
    }
}