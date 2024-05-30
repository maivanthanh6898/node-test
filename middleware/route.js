const log = require("../utils/log");
const bodyParser = require("body-parser");
const createUser = require("../service/userService");
const authService = require("../service/authService");
const jwt = require("../security/jwtAuthenticator");
const urlencodedParser = bodyParser.urlencoded({extended: false});
require("dotenv").config();

function doExecAPINotAuth(req, res, func) {
    if (req.query != null) {
        Object.keys(req.query).forEach(key => {
            req.query[key] = req.query[key].replace(/[^a-zA-Z0-9 \-_]/g, "");
        });
    }
    if (req.body != null) {
        Object.keys(req.query).forEach(key => {
            req.query[key] = req.query[key].replace(/[^a-zA-Z0-9 \-_]/g, "");
        });
    }
    log.infor(`Receive request with \n\tbody: ${JSON.stringify(req.body)}\n\tQuery: ${JSON.stringify(req.query)}\n\tParam: ${JSON.stringify(req.params)}\n\turl: ${JSON.stringify(req.url)}`);
    try {
        func(req, res);
    } catch (e) {
        log.error("resp: ", e);
        res.status(500);
        res.send({code: '500', message: 'INTERNAL_SERVER_ERROR'});
    }
    return;
}

function doExecAPIAuth(req, res, func) {
    if (req.query != null) {
        Object.keys(req.query).forEach(key => {
            req.query[key] = req.query[key].replace(/[^a-zA-Z0-9 \-_]/g, "");
        });
    }
    if (req.body != null) {
        Object.keys(req.query).forEach(key => {
            req.query[key] = req.query[key].replace(/[^a-zA-Z0-9 \-_]/g, "");
        });
    }
    let verifyRes = jwt.verifyToken(req, res);
    if (verifyRes != null) return verifyRes;
    log.infor(`Receive request with \n\tbody: ${JSON.stringify(req.body)}\n\tQuery: ${JSON.stringify(req.query)}\n\tParam: ${JSON.stringify(req.params)}\n\turl: ${JSON.stringify(req.url)}`);
    try {
        func(req, res);
    } catch (e) {
        log.error("resp: ", e);
        res.status(500);
        res.send({code: '500', message: 'INTERNAL_SERVER_ERROR'});
    }
    return;
}

module.exports = function (app) {
    app.post("/api/v1/register", urlencodedParser, (req, res) => doExecAPINotAuth(req, res, createUser.createUser));
    app.get("/api/v1/user/info", urlencodedParser, (req, res) => doExecAPIAuth(req, res, createUser.getUserInfo));
    app.post("/api/v1/login", urlencodedParser, (req, res) => doExecAPINotAuth(req, res, authService.login));
    app.put("/api/v1/user/lockdown", urlencodedParser, (req, res) => doExecAPIAuth(req, res, createUser.lockUser));
    app.delete("/api/v1/user/delete", urlencodedParser, (req, res) => doExecAPIAuth(req, res, createUser.deleteUser));
};