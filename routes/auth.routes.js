const { verifySignUp } = require("../middleware");
const controller = require("../controllers/controller.auth");
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
    router.get('/auth',
        controller.baseURL
    );
    router.post('/auth/signup',
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ],
        controller.signup
    );
    router.post('/auth/signin', controller.signin);
    router.post('/signauth/refreshtoken', controller.refreshToken);

    // console.log('app in auth routes file: ',app);
    module.exports = router;
// };