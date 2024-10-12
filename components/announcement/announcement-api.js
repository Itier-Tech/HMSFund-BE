const router = require("express").Router();
const { authMiddleware } = require("../../middlewares/auth-middleware");
const announcementController = require("./announcement-controller");

// Public routes
router.get("/announcement", announcementController.getAllAnnouncement);
router.get("/announcement/:id", announcementController.getAnnouncementById);

// Protected routes
router.post(
    "/announcement",
    authMiddleware,
    announcementController.createAnnouncement
);
router.put(
    "/announcement/:id",
    authMiddleware,
    announcementController.updateAnnouncement
);
router.delete(
    "/announcement/:id",
    authMiddleware,
    announcementController.deleteAnnouncement
);

module.exports = router;
