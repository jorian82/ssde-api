const db = require('../models');
const User = db.users;
// const Op = db.Sequelize.Op;

exports.create = (req, res) => {};
exports.findAll = (req, res) => {};
exports.findOne = (req, res) => {};
exports.update = (req, res) => {};
exports.delete = (req, res) => {};
exports.deleteAll = (req, res) => {};
exports.findAllPublished = (req, res) => {};

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};
exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};
exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};
exports.creatorBoard = (req, res) => {
    res.status(200).send("Creator Content.");
};
exports.getProfile = (req, res) => {
    db.connect();
    User.findOne({ "username": req.body.username })
    .then( async ( user ) => {
        if (!user) {
            db.close();
            return res.status(404).send({ message: "User Not found." });
        }
        let authorities = [];
        user.populate('role').then(roles => {
            for (let i = 0; i < roles.length; i++) {
                authorities.push("ROLE_" + roles[i].name.toUpperCase());
            }
            db.close();
            res.status(200).send({
                id: user.id,
                username: user.username,
                fullName: user.firstName + ' ' + user.lastName,
                email: user.email,
                roles: authorities,
            });
        });        
    })
    .catch ( error => {
        db.close();
        res.status(500).send({ message: error.message });
    });
}