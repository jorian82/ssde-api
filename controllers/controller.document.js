const db = require('../models');
const Document = db.documents;
const Comments = db.comments;
const Categories = db.categories;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {};
exports.findAll = (req, res) => {};
exports.findOne = (req, res) => {};
exports.update = (req, res) => {};
exports.delete = (req, res) => {};
exports.deleteAll = (req, res) => {};
exports.findAllPublished = (req, res) => {};

exports.filter = (req, res) => {
    Document.findAll({
        where: { title: {
            [Op.substring] : req.body.q
        }}
    })
}