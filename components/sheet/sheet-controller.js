const SheetRepository = require("./sheet-repository");

const repo = new SheetRepository();

module.exports = {
    async saveData(req, res) {
        try {
            const data = req.body;
            const result = await repo.saveData(data);
            res.status(200).json({
                success: true,
                message: "Data saved successfully!",
                result,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to create activity.",
                error: error.message,
            });
        }
    },
};
