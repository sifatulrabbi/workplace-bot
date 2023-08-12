/* jshint node: true, devel: true */
"use strict";

require("dotenv").config();

/* Require dependencies */
const express = require("express"),
    // crypto = require("crypto"),
    bodyParser = require("body-parser");

/* Loads dependencies */
const config = require("./config/variables.js"),
    graph = require("./utils/graph-client.js")(config),
    // encryption = require("./services/encryption.js")(crypto, config),
    messages = require("./services/messages.js")(graph),
    validators = require("./utils/webhook-validators.js")(config),
    gsheet = require("./services/gsheet.js");

/* Create express app */
const app = express();

/* Run app */
app.set("port", process.env.PORT || 8080);
app.use(bodyParser.json());
// app.set("view engine", "ejs");
// app.use(bodyParser.json({ verify: encryption.signCheck }));
// app.use(express.static("public"));
app.listen(app.get("port"), () => {
    console.log("WP Hello app listening on port " + app.get("port") + "!");
});

/* Setup default webhook endpoints */
// validators.setupHeartbeat(app); //set up heartbeat endpoint
validators.setupTokenCheck(app); //set up token validation endpoints

/* Handle webhook payloads from Facebook */
app.post("/webhook", async (req, res) => {
    try {
        const responses = await gsheet.getSheetWithSAuth();
        const msgs = messages.getMessages(req);
        for (const msg of msgs) await messages.handleMessage(msg, responses);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        // res.sendStatus(500);
        res.sendStatus(200); // sending 200 just for now.
    }
});
