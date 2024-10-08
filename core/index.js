const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const serverConfig = require("./config/server-config");
const db = require("./database/supabase");

const authApis = require("../components/auth/auth-api");

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
    }

    getDatabase() {
        return this.db;
    }

    run() {
        this.express.listen(this.serverConfig.port, () => {
            this.setupServer();
            console.log(
                `Server is running on http://localhost:${this.serverConfig.port}`
            );
        });
    }
}

module.exports = new Application();
