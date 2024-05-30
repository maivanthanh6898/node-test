const jwt = require('jsonwebtoken');
const log = require('../utils/log');
require("dotenv").config();

let secretKey = process.env.SEC_KEY;
secretKey = secretKey == null || secretKey == "" ? "" : secretKey

function generateToken(userInformation) {
    const payload = {
        id: userInformation.id,
        username: userInformation.username,
        name: userInformation.name,
        email: userInformation.email
    }
    return jwt.sign(payload, secretKey, {expiresIn: '8h'});
}

function verifyToken(req, res) {
    const authorizationClient = req.headers['authorization'];
    const token = authorizationClient && authorizationClient.split(' ')[1]

    if (!token) {
        return res.sendStatus(401);
    }
    try {
        let decode = jwt.verify(token, secretKey)
        return null;
    } catch (e) {
        log.error(e)
        return res.sendStatus(403)
    }
}

function getIdFromToken(req, res) {
    const authorizationClient = req.headers['authorization'];
    const token = authorizationClient && authorizationClient.split(' ')[1]
    try {
        let decode = jwt.verify(token, secretKey)
        return decode.id;
    } catch (e) {
        log.error(e)
        return res.sendStatus(403)
    }
}

module.exports = {generateToken, verifyToken, getIdFromToken}