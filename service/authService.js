const jwt = require('../security/jwtAuthenticator')
const UserInformation = require('../model/userInformations');
const {Op} = require('sequelize');
const log = require('../utils/log');
const util = require('util');
const sec = require('../security/aesCrypto');

async function login(req, res) {
    let decryptedBody = null;
    try {
        decryptedBody = sec.decrypt(req.body.data)
    } catch (e) {
        log.error(e)
    }
    if (decryptedBody == null || decryptedBody == "") {
        let resp = {
            code: "003",
            message: "INVALID_BODY_REQUEST"
        }
        res.status(400);
        res.end(JSON.stringify(resp));
        return res;
    }
    decryptedBody = JSON.parse(decryptedBody);
    let userInformation = await UserInformation.findAll({
        where: {
            username: {
                [Op.eq]: decryptedBody.username
            },
            password: {
                [Op.eq]: decryptedBody.password
            }
        }
    })
    userInformation = userInformation.map(o => o.dataValues)
    // if (userInformation[0].status != 'ACTIVE') {
    //     log.infor(userInformation[0].username + "-" + userInformation[0].status)
    //     let resp = {
    //         code: "007",
    //         message: "INVALID_ACCOUNT_STATUS"
    //     }
    //     res.status(403);
    //     res.end(JSON.stringify(resp));
    //     return res;
    // }
    let token = jwt.generateToken(userInformation[0]);
    let resp = {
        code: "00",
        data: {accessToken: token, expiredIn: 28800}
    }
    res.status(200);
    res.end(JSON.stringify(resp));
    return res;
}

module.exports = {login}