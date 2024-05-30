const sequelize = require('./dbConfig');
const UserInformation = require('../model/userInformations');
const logger = require('../utils/log')

async function syncDatabase() {
    try {
        await sequelize.authenticate();
        logger.infor('Connection has been established successfully.');

        await UserInformation.sync({force: process.env.FORCE_CREATE_DB}); // Use { force: true } to drop and recreate the table
        logger.infor('UserInformation table has been created.');

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = {syncDatabase};
