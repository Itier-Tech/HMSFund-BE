const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
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

            const hashedPassword = await bcrypt.hash(user.password, 10);

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
                    username: user.username,
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

    async register(req, res) {
        const { username, password } = req.body;
        const repo = new AuthRepository();

        try {
            const user = await repo.findUserByUsername(username);
            if (user) {
                throw new Error("User duplicate");
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
                id: uuidv4(),
                username,
                password: hashedPassword,
            };
            const userRef = await repo.createUser(newUser);

            const token = jwt.sign(
                {
                    id: newUser.id,
                    username: newUser.username,
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
