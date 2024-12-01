const router = require("express").Router();
const sheetController = require("./sheet-controller");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

router.post("/save-data", upload.any(), sheetController.saveData);

module.exports = router;
