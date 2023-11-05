const { authJwt } = require("../middleware");
const controller = require("../controllers/controller.user");
const express = require('express');
const router = express.Router();

// module.exports = function(app) {

    router.use(function(req, res, next) {
        res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    router.get(
        '/user/test/all', 
        controller.allAccess
    );

    router.get(
        '/user/test/user',
        [authJwt.verifyToken],
        controller.userBoard
    );
    
    router.get(
        '/user/test/mod',
        [authJwt.verifyToken, authJwt.isCreatorOrAdmin],
        controller.creatorBoard
    );
    
    router.get(
        '/user/test/admin',
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard
    );

    router.post(
        '/user/profile',
        [authJwt.verifyToken],
        controller.getProfile
    );

    router.get(
        '/user/all',
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.findAll
    )

    // console.log('app in user routes file: ',app);

    module.exports = router;
// };
