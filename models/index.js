const db = {};
const mongoose = require('mongoose');

// MongoDB configuration
const dbConfig = require('../config/db.config.mongodb');
const uri = `mongodb+srv://${dbConfig.username}:${dbConfig.password}@${dbConfig.cluster}`;
const database = 'ssde-blogs'; // REPLACE WITH YOUR DB NAME
// const chalk = require('chalk');
const chalk = require('chalk');

const connected = chalk.bold.cyan;
const error = chalk.bold.yellow;
const disconnected = chalk.bold.red;
const termination = chalk.bold.magenta;

//DB table definition
db.mongoose = mongoose
db.users = require('./model.user')(mongoose);
db.roles = require('./model.role')(mongoose);
db.posts = require('./model.post')(mongoose);
db.comments = require('./model.comment')(mongoose);
db.token = require('./model.refreshToken')(mongoose);

// DB tables relationships
db.ROLES = ['user','admin','creator'];

db.connect = () => {
    db.mongoose.connect(`${uri}/${database}`);

    db.mongoose.connection.on('connected', () => {
        console.log(connected("Mongoose default connection is open to ", dbConfig.cluster));
    });

    db.mongoose.connection.on('error', (err) => {
        console.log(error("Mongoose default connection has occured "+err+" error"));
    });

    db.mongoose.connection.on('disconnected', () => {
        console.log(disconnected("Mongoose default connection is disconnected"));
    });

    process.on('SIGINT', () => {
        console.log(termination("Mongoose default connection is disconnected due to application termination"));
        db.mongoose.connection.close();
        process.exit(0)
    });
}

db.close = () => {
    db.mongoose.connection.close();
}

module.exports = db;
