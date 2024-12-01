const SheetRepository = require("./sheet-repository");
const fs = require("fs");

const repo = new SheetRepository();

module.exports = {
    async saveData(req, res) {
        try {
            const { nim } = req.body;
            if (!nim) {
                throw new Error("NIM is required to organize files.");
            }

            const fileLinks = await repo.uploadFilesToDrive(req.files, nim);
            const completeData = { ...req.body, ...fileLinks };
            const result = await repo.saveData(completeData);

            res.status(200).json({
                success: true,
                message: "Data saved successfully!",
                result,
            });
        } catch (error) {
            console.error("Error in saveData:", error);
            res.status(500).json({
                success: false,
                message: "Failed to save data.",
                error: error.message,
            });
        }
    },
};
