const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AuthRepository = require("./auth-repository");

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
    async login(req, res) {
        const { username, password } = req.body;
        const repo = new AuthRepository();

        try {
            const user = await repo.findUserByUsername(username);
            if (!user) {
                throw new Error("User not found");
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );
            if (!isPasswordValid) {
                throw new Error("Invalid credentials");
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
                JWT_SECRET,
                {
                    expiresIn: "1h",
                }
            );
            res.status(200).json({ success: true, token });
        } catch (error) {
            res.status(401).json({ success: false, message: error.message });
        }
    },

    async getAllUser(req, res) {
        const repo = new AuthRepository();

        try {
            const users = await repo.findAll();
            res.status(200).json({ success: true, users });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
