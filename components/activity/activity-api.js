const router = require("express").Router();
const { authMiddleware } = require("../../middlewares/auth-middleware");
const upload = require("../../middlewares/upload-middleware");
const activityController = require("./activity-controller");

// Public routes
router.get("/activity", activityController.getAllActivity);
router.get("/activity/:id", activityController.getActivityById);

// Protected routes
router.use(authMiddleware);
router.post(
    "/activity",
    upload.single("image"),
    activityController.createActivity
);
router.put(
    "/activity/:id",
    upload.single("image"),
    activityController.updateActivity
);
router.delete("/activity/:id", activityController.deleteActivity);

module.exports = router;
