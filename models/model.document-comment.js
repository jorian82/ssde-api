const { Sequelize } = require("sequelize");
const sequelize = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const DocumentComment = sequelize.define("documentcomment", {
        documentId: {
            type: Sequelize.STRING
        },
        commentId: {
            type: Sequelize.BIGINT
        }
    });

    return DocumentComment;
}