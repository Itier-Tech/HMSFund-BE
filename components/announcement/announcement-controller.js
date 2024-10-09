const AnnouncementRepository = require("./announcement-repository");

const repo = new AnnouncementRepository();

module.exports = {
    async getAllAnnouncement(req, res) {
        try {
            const announcements = await repo.findAll();
            res.status(200).json({ success: true, announcements });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve announcements.",
                error: error.message,
            });
        }
    },

    async getAnnouncementById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Announcement ID is required.",
                });
            }

            const announcement = await repo.findAnnouncementById(id);
            if (!announcement) {
                return res.status(404).json({
                    success: false,
                    message: "Announcement not found.",
                });
            }
            res.status(200).json({ success: true, announcement });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve announcement.",
                error: error.message,
            });
        }
    },

    async createAnnouncement(req, res) {
        try {
            const { body } = req;
            if (!body) {
                return res.status(400).json({
                    success: false,
                    message: "Announcement data is required.",
                });
            }

            const announcement = await repo.createAnnouncement(body);
            res.status(201).json({ success: true, announcement });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to create announcement.",
                error: error.message,
            });
        }
    },

    async updateAnnouncement(req, res) {
        try {
            const { id } = req.params;
            const { body } = req;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Announcement ID is required.",
                });
            }

            const updatedAnnouncement = await repo.updateAnnouncement(id, body);
            if (!updatedAnnouncement) {
                return res.status(404).json({
                    success: false,
                    message: "Announcement not found.",
                });
            }

            res.status(200).json({
                success: true,
                announcement: updatedAnnouncement,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to update announcement.",
                error: error.message,
            });
        }
    },

    async deleteAnnouncement(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Announcement ID is required.",
                });
            }

            const deleted = await repo.deleteAnnouncement(id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: "Announcement not found.",
                });
            }

            res.status(200).json({
                success: true,
                message: "Announcement deleted successfully.",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to delete announcement.",
                error: error.message,
            });
        }
    },
};
