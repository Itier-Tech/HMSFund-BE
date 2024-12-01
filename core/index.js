const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const serverConfig = require("./config/server-config");
const db = require("./database/supabase");

const authApis = require("../components/auth/auth-api");
const activityApis = require("../components/activity/activity-api");
const announcementApis = require("../components/announcement/announcement-api");
const bannerApis = require("../components/banner/banner-api");
const sheetApis = require("../components/sheet/sheet-api");

class Application {
    constructor() {
        this.express = express();
        this.serverConfig = serverConfig;
        this.db = db;
    }

    setupServer() {
        this.express.use(cors());
        this.express.use(morgan("dev"));
        this.express.use(express.json());

        this.express.get("/api", (req, res) => {
            res.send("Welcome to HMS Fund Backend Web Services!");
        });

        this.express.use("/api", authApis);
        this.express.use("/api", activityApis);
        this.express.use("/api", announcementApis);
        this.express.use("/api", bannerApis);
        this.express.use("/api", sheetApis);
    }

    getDatabase() {
        return this.db;
    }

    run() {
        this.express.listen(this.serverConfig.port, () => {
            this.setupServer();
        });
    }
}

module.exports = new Application();
