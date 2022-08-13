const { Sequelize } = require("sequelize");
const sequelize = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const UserRole = sequelize.define("userrole", {
        user: {
            type: Sequelize.STRING
        },
        role: {
            type: Sequelize.STRING
        }
    });

    return UserRole;
}