require('dotenv').config();

const username = encodeURIComponent(process.env.mongoDB_usr);
const password = encodeURIComponent(process.env.mongoDB_pwd);
const cluster = process.env.mongoDB_cluster;

module.exports = {
    username: username,
    password: password,
    cluster: cluster
}