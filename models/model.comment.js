const { Sequelize } = require("sequelize");
const sequelize = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("comment", {
        documentId: {
            type: Sequelize.STRING
        },
        comment: {
            type: Sequelize.TEXT
        },
        state: {
            type: Sequelize.STRING
        },
    });

    return Comment;
}