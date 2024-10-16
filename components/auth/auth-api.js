const router = require("express").Router();
const authController = require("./auth-controller");

router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.get("/auth/user", authController.getAllUser);

module.exports = router;
