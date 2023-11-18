const db = require('../models');
const User = db.users;
const Tokens = db.token;

exports.create = (req, res) => {};
exports.findAll = (req, res) => {
    User.find({}).populate('roles')
        .then( users => {
            res.status(200).send({
                message: "success",
                data: users
            });
        })
        .catch(error => {
            res.status(500).send({
                message: "Error getting users",
                error: error
            });
        });
};
exports.findOne = (req, res) => {};
exports.update = (req, res) => {};
exports.delete = (req, res) => {};
exports.deleteAll = (req, res) => {};
exports.findAllPublished = (req, res) => {};

exports.allAccess = (req, res) => {
    res.status(200).send({
        "message": "success",
        "data":"Public Content."
    });
};
exports.userBoard = (req, res) => {
    res.status(200).send({
        "message": "success",
        "data": "User Content."
    });
};
exports.adminBoard = (req, res) => {
    res.status(200).send({
        "message": "success",
        "data":"Admin Content."
    });
};
exports.creatorBoard = (req, res) => {
    res.status(200).send({
        "message": "success",
        "data": "Creator Content."
    });
};
exports.getProfile = (req, res) => {
    User.findOne({ "username": req.body.username }).populate('roles')
    .then( async ( user ) => {
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }
        let authorities = [];
        user.roles.forEach(role => {
            authorities.push(role.name);
        });
        res.status(200).send({
            id: user.id,
            username: user.username,
            fullName: user.firstName + ' ' + user.lastName,
            email: user.email,
            roles: authorities,
        });
    })
    .catch ( error => {
        res.status(500).send({ message: error.message });
    });
;}

exports.signout = (req, res) => {
}