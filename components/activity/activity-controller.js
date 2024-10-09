const ActivityRepository = require("./activity-repository");

const repo = new ActivityRepository();

module.exports = {
    async getAllActivity(req, res) {
        try {
            const activities = await repo.findAll();
            res.status(200).json({ success: true, activities });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve activities.",
                error: error.message,
            });
        }
    },

    async getActivityById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Activity ID is required.",
                });
            }

            const activity = await repo.findActivityById(id);
            if (!activity) {
                return res
                    .status(404)
                    .json({ success: false, message: "Activity not found." });
            }

            res.status(200).json({ success: true, activity });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve activity.",
                error: error.message,
            });
        }
    },

    async createActivity(req, res) {
        try {
            const { body } = req;
            if (!body) {
                return res.status(400).json({
                    success: false,
                    message: "Activity data is required.",
                });
            }

            const activity = await repo.createActivity(body);
            res.status(201).json({ success: true, activity });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to create activity.",
                error: error.message,
            });
        }
    },

    async updateActivity(req, res) {
        try {
            const { id } = req.params;
            const { body } = req;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Activity ID is required.",
                });
            }

            const updatedActivity = await repo.updateActivity(id, body);
            if (!updatedActivity) {
                return res
                    .status(404)
                    .json({ success: false, message: "Activity not found." });
            }

            res.status(200).json({ success: true, activity: updatedActivity });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to update activity.",
                error: error.message,
            });
        }
    },

    async deleteActivity(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Activity ID is required.",
                });
            }

            const deleted = await repo.deleteActivity(id);
            if (!deleted) {
                return res
                    .status(404)
                    .json({ success: false, message: "Activity not found." });
            }

            res.status(200).json({
                success: true,
                message: "Activity deleted successfully.",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to delete activity.",
                error: error.message,
            });
        }
    },
};
