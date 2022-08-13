
// SQLite configuration
const dbConfig = require("../config/db.config.sqlite");
const Sequelize = require("sequelize");

const sequelize = new Sequelize({
    dialect: dbConfig.dialect,
    storage: dbConfig.storage
});

// MySQL configuration
/*
const dbConfig = require("../config/db.config.mysql");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD ,{
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});
*/

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//DB table definition
db.users = require('./model.user')(sequelize, Sequelize);
db.roles = require('./model.role')(sequelize, Sequelize);
// db.usersroles = require('./model.user-role')(sequelize, Sequelize);
db.documents = require('./model.document')(sequelize, Sequelize);
db.comments = require('./model.comment')(sequelize, Sequelize);
db.documentscomments = require('./model.document-comment')(sequelize, Sequelize);
db.categories = require('./model.category')(sequelize, Sequelize);
db.documentscategories = require('./model.document-category')(sequelize, Sequelize);
db.companies = require('./model.company')(sequelize, Sequelize);
db.refreshToken = require('./model.refreshToken')(sequelize, Sequelize);

// DB tables relationships
db.documents.hasMany(db.comments, {as: 'comments'});
db.documents.hasMany(db.categories, {as: 'categories'});
db.comments.belongsTo(db.documents, {
    foreignKey: 'documentId', 
    as: 'document'
});
db.categories.belongsTo(db.documents, {
    foreignKey: 'documentId',
    as: 'document'
});
db.roles.belongsToMany(db.users, {
    through: 'users_roles',
    foreignKey: 'roleId',
    otherKey: 'userId'
});
db.users.belongsToMany(db.roles, {
    through: 'users_roles',
    foreignKey: 'userId',
    otherKey: 'roleId'
});
db.refreshToken.belongsTo(db.users, {
    foreignKey: 'userId', 
    targetKey: 'id'
})
db.users.hasOne(db.refreshToken, {
    foreignKey: 'userId',
    targetKey: 'id'
})
db.ROLES = ['user','admin','creator'];

//DB object export
module.exports = db;