const { Sequelize } = require("sequelize");
const sequelize = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Document = sequelize.define('document', {
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        uuid: {
            type: Sequelize.STRING
        },
        link: {
            type: Sequelize.STRING
        },
        tags: {
            type: Sequelize.TEXT
        },
        company: {
            type: Sequelize.STRING
        }
    });

    return Document;
}