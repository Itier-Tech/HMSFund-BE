const router = require("express").Router();
const { authMiddleware } = require("../../middlewares/auth-middleware");
const announcementController = require("./announcement-controller");

// Public routes
router.get("/announcement", announcementController.getAllAnnouncement);
router.get("/announcement/:id", announcementController.getAnnouncementById);

// Protected routes
router.use(authMiddleware);
router.post("/announcement", announcementController.createAnnouncement);
router.put("/announcement/:id", announcementController.updateAnnouncement);
router.delete("/announcement/:id", announcementController.deleteAnnouncement);

module.exports = router;
