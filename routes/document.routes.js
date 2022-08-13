const { authJwt } = require("../middleware");
const controller = require("../controllers/controller.document");

module.exports = function(app) {

    app.use(function(req, res, next) {
        res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get(
        '/api/documents',
        [authJwt.verifyToken],
        controller.findAll
    );

    app.get(
        '/api/documents/filter',
        [authJwt.verifyToken],
        controller.filter
    );

};