const BannerRepository = require("./banner-repository");

const repo = new BannerRepository();

module.exports = {
    async getAllBanner(req, res) {
        try {
            const banners = await repo.findAll();
            res.status(200).json({ success: true, banners });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve banners.",
                error: error.message,
            });
        }
    },

    async getBannerById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Banner ID is required.",
                });
            }

            const banner = await repo.findBannerById(id);
            if (!banner) {
                return res
                    .status(404)
                    .json({ success: false, message: "Banner not found." });
            }

            res.status(200).json({ success: true, banner });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve banner.",
                error: error.message,
            });
        }
    },

    async createBanner(req, res) {
        try {
            const { body } = req;
            if (!body) {
                return res.status(400).json({
                    success: false,
                    message: "Banner data is required.",
                });
            }

            const banner = await repo.createBanner(body);
            res.status(201).json({ success: true, banner });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to create banner.",
                error: error.message,
            });
        }
    },

    async updateBanner(req, res) {
        try {
            const { id } = req.params;
            const { body } = req;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Banner ID is required.",
                });
            }

            const updatedBanner = await repo.updateBanner(id, body);
            if (!updatedBanner) {
                return res
                    .status(404)
                    .json({ success: false, message: "Banner not found." });
            }

            res.status(200).json({ success: true, banner: updatedBanner });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to update banner.",
                error: error.message,
            });
        }
    },

    async deleteBanner(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Banner ID is required.",
                });
            }

            const deleted = await repo.deleteBanner(id);
            if (!deleted) {
                return res
                    .status(404)
                    .json({ success: false, message: "Banner not found." });
            }

            res.status(200).json({
                success: true,
                message: "Banner deleted successfully.",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to delete banner.",
                error: error.message,
            });
        }
    },
};
