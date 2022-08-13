const { Sequelize } = require("sequelize");
const sequelize = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const DocumentCategory = sequelize.define("documentcategory", {
        documentId: {
            type: Sequelize.STRING
        },
        commentId: {
            type: Sequelize.BIGINT
        }
    });

    return DocumentCategory;
}