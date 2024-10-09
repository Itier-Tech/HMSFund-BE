const router = require("express").Router();
const { authMiddleware } = require("../../middlewares/auth-middleware");
const upload = require("../../middlewares/upload-middleware");
const bannerController = require("./banner-controller");

// Public routes
router.get("/banner", bannerController.getAllBanner);
router.get("/banner/:id", bannerController.getBannerById);

// Protected routes
router.use(authMiddleware);
router.post("/banner", upload.single("image"), bannerController.createBanner);
router.put(
    "/banner/:id",
    upload.single("image"),
    bannerController.updateBanner
);
router.delete("/banner/:id", bannerController.deleteBanner);

module.exports = router;
