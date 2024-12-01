const BannerRepository = require("./banner-repository");
const { uploadImage } = require("../util/file-helper");

const repo = new BannerRepository();

module.exports = {
    async getAllBanner(req, res) {
        try {
            const limit = parseInt(req.query.limit, 10) || 5;
            const offset = parseInt(req.query.offset, 10) || 0;

            const banners = await repo.findAll({ limit, offset });
            const totalBanners = await repo.getTotalCount();
            const totalPages = Math.ceil(totalBanners / limit);

            res.status(200).json({
                success: true,
                banners,
                totalPages,
            });
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
            const { title, date } = req.body;
            const file = req.file;

            if (!title || !date || !file) {
                return res.status(400).json({
                    success: false,
                    message: "Banner title, date, and image are required.",
                });
            }

            const newBanner = await repo.createBanner({
                title,
                date,
                banner_photo: "",
            });

            const imageUrl = await uploadImage(file, "banners", newBanner.id);
            const updatedBanner = await repo.updateBanner(newBanner.id, {
                banner_photo: imageUrl,
            });

            res.status(201).json({ success: true, updatedBanner });
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
            const { title, date } = req.body;
            const file = req.file;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Banner ID is required.",
                });
            }

            const existingBanner = await repo.findBannerById(id);
            if (!existingBanner) {
                return res
                    .status(404)
                    .json({ success: false, message: "Banner not found." });
            }

            let bannerData = { title, date };

            if (file) {
                const imageUrl = await uploadImage(file, "banners", id);
                bannerData.banner_photo = imageUrl;
            }

            const updatedBanner = await repo.updateBanner(id, bannerData);

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
