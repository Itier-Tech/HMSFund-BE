const router = require("express").Router();
const authMiddleware = require("../../middlewares/auth-middleware");
const authController = require("./auth-controller");

router.post("/auth/login", authController.login);

module.exports = router;
