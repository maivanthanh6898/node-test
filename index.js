const route = require("./middleware/route");
const express = require("express");
const config = require("./config/config");
const log = require("./utils/log");
const cors = require("cors");
const bodyParser = require("body-parser");
const sync = require('./config/sync');

async function main() {
    const app = express();
    app.use(cors());
    const rawBodySaver = function (req, res, buf) {
        if (buf && buf.length) {
            req.rawBody = buf.toString();
        }
    }
    app.use(bodyParser.json({verify: rawBodySaver}));
    app.use(bodyParser.urlencoded({verify: rawBodySaver, extended: true}));
    app.use(bodyParser.raw({verify: rawBodySaver, type: '*/*'}));
    route(app);

    try {
        await sync.syncDatabase();
        app.listen(config.host, () => {
            log.infor(`Server is start at port: ${config.host}`);
        });
    } catch (e) {
        console.log(new Date(), `: ${e}`);
    }
}

main().then();