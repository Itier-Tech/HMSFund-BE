const router = require("express").Router();
const { authMiddleware } = require("../../middlewares/auth-middleware");
const bannerController = require("./banner-controller");

// Public routes
router.get("/banner", bannerController.getAllBanner);
router.get("/banner/:id", bannerController.getBannerById);

// Protected routes
router.use(authMiddleware);
router.post("/banner", bannerController.createBanner);
router.put("/banner/:id", bannerController.updateBanner);
router.delete("/banner/:id", bannerController.deleteBanner);

module.exports = router;
