const ActivityRepository = require("./activity-repository");
const uploadImage = require("../util/file-helper");
const deleteImage = require("../util/file-helper");

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
            const { title, date, description } = req.body;
            const file = req.file;
            
            if (!title || !date || !file) {
                return res.status(400).json({
                    success: false,
                    message: "Activity title, date, and image are required.",
                });
            }

            const newActivity = await repo.createActivity({
                title,
                date,
                description,
                banner_photo: "",
            });

            const imageUrl = await uploadImage(file, "activity", newActivity.id);
            const updatedActivity = await repo.updateActivity(newActivity.id, {
                banner_photo: imageUrl,
            });

            res.status(201).json({ success: true, activity: updatedActivity });
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
            const { title, date, description } = req.body;
            const file = req.file;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Activity ID is required.",
                });
            }

            const existingActivity = await repo.findActivityById(id);
            if (!existingActivity) {
                return res
                    .status(404)
                    .json({ success: false, message: "Activity not found." });
            }

            let activityData = { title, date, description };

            if (file) {
                // Upload the new image.
                const imageUrl = await uploadImage(file, "activities", id);
                activityData.banner_photo = imageUrl;
            }

            const updatedActivity = await repo.updateActivity(id, activityData);


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

            const existingActivity = await repo.findActivityById(id);
            if (!existingActivity) {
                return res
                    .status(404)
                    .json({ success: false, message: "Activity not found." });
            }

            await deleteImage("activities", existingActivity.banner_photo);

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
