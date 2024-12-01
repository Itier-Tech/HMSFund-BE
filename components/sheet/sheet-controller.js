const SheetRepository = require("./sheet-repository");
const fs = require("fs");

const repo = new SheetRepository();

module.exports = {
    async saveData(req, res) {
        try {
            console.log("Request body:", req.body);
            console.log("Request files:", req.files);

            const { nim } = req.body;
            if (!nim) {
                throw new Error("NIM is required to organize files.");
            }

            const fileLinks = await repo.uploadFilesToDrive(req.files, nim);
            console.log("Uploaded file links:", fileLinks);

            const completeData = { ...req.body, ...fileLinks };
            console.log("Complete data to save:", completeData);

            const result = await repo.saveData(completeData);
            console.log("Data saved to Google Sheets:", result);

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
