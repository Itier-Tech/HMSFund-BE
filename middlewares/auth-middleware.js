const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

module.exports = {
    authMiddleware(req, res, next) {
        const authHeader = req.headers.authorization;

        if (!authHeader || (authHeader && !authHeader.startsWith("Bearer "))) {
            return res.status(401).json({
                success: false,
                message: "User not authorized",
            });
        }

        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, jwtSecret);
            req.body.userID = decoded.id;
            req.body.username = decoded.username;
            next();
        } catch (error) {
            return res.status(403).json({
                success: false,
                message: "Invalid JWT token!",
            });
        }
    },
};
