// example.js
const UserInformation = require('../model/userInformations');
const log = require('../utils/log')
const sec = require("../security/aesCrypto");
const jwt = require("../security/jwtAuthenticator");
const {Op} = require('sequelize');

async function userService(req, res) {
    try {
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
        const newUser = await UserInformation.create({
            avatar: 'avatar-url.png',
            level: 1,
            username: decryptedBody.username,
            password: decryptedBody.password,
            exp: 0,
            point: 100,
            levelBadge: 'Beginner',
            name: decryptedBody.name,
            email: decryptedBody.email,
            status: 'ACTIVE',
            createTime: new Date(),
            updateTime: new Date(),
        });

        console.log('New user created:', newUser.toJSON());
        let resp = {
            code: "00",
            data: {
                id: newUser.toJSON().id
            }
        }
        res.status(200);
        res.end(JSON.stringify(resp));
        return res;
    } catch (error) {
        let resp = {};
        log.error('Error creating user:', JSON.stringify(error));
        if (error.name != null && error.name == "SequelizeValidationError") {
            resp = {
                code: "001",
                message: "INVALID_DATA_REQUEST"
            }

        } else if (error.name != null && error.name == "SequelizeUniqueConstraintError") {
            resp = {
                code: "004",
                message: "USERNAME_IS_EXISTED"
            }

        } else {
            resp = {
                code: "005",
                message: "INTENAL_SERVER_ERROR"
            }
        }
        res.status("400");
        res.end(JSON.stringify(resp));
        return res;
    }
}

async function getUserInfo(req, res) {
    const user = await UserInformation.findAll({
        where: {
            id: {
                [Op.eq]: jwt.getIdFromToken(req, res)
            },
            status: {
                [Op.eq]: "ACTIVE"
            }
        }
    })
    if (user[0].dataValues != null) {
        delete user[0].dataValues.password
        let resp = {
            code: "00",
            data: user[0].dataValues
        }
        res.status(200);
        res.end(JSON.stringify(resp));
        return res;
    } else {
        let resp = {
            code: "002",
            message: "USER_NOT_EXIST"
        }
        res.status(400);
        res.end(JSON.stringify(resp));
        return res;
    }
}

async function lockUser(req, res) {
    const user = await UserInformation.findAll({
        where: {
            id: {
                [Op.eq]: jwt.getIdFromToken(req, res)
            },
            status: {
                [Op.eq]: "ACTIVE"
            }
        }
    })
    if (user[0] != null && user[0].dataValues != null) {
        await UserInformation.update({status: "LOCK"}, {
            where: {
                id: {
                    [Op.eq]: user[0].dataValues.id
                }
            }
        })
        let resp = {
            code: "00",
            message: "SUCCESS"
        }
        res.status(200);
        res.end(JSON.stringify(resp));
        return res;
    } else {
        let resp = {
            code: "006",
            message: "USER_NOT_FOUND"
        }
        res.status(400);
        res.end(JSON.stringify(resp));
        return res;
    }
}


async function deleteUser(req, res) {
    const user = await UserInformation.findAll({
        where: {
            id: {
                [Op.eq]: jwt.getIdFromToken(req, res)
            }
        }
    })
    if (user[0].dataValues != null) {
        await UserInformation.destroy({
            where: {
                id: {
                    [Op.eq]: user[0].dataValues.id
                }
            }
        })
        let resp = {
            code: "00",
            message: "SUCCESS"
        }
        res.status(200);
        res.end(JSON.stringify(resp));
        return res;
    } else {
        let resp = {
            code: "006",
            message: "USER_NOT_FOUND"
        }
        res.status(400);
        res.end(JSON.stringify(resp));
        return res;
    }
}


module.exports = {createUser: userService, getUserInfo, lockUser, deleteUser}
