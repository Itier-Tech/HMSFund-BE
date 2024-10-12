const router = require("express").Router();
const sheetController = require("./sheet-controller");

router.post("/save-data", sheetController.saveData);

module.exports = router;