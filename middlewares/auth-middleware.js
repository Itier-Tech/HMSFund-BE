const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
}

module.exports = {
    authMiddleware(req, res, next) {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message:
                    "Authorization header missing or improperly formatted.",
            });
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, jwtSecret);
            req.user = {
                id: decoded.id,
                username: decoded.username,
            };
            next();
        } catch (error) {
            return res.status(403).json({
                success: false,
                message: "Invalid or expired JWT token.",
            });
        }
    },
};
