const { verifySignUp, authJwt} = require("../middleware");
const controller = require("../controllers/controller.post");
const express = require('express');
const router = express.Router();

router.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

router.post(
    '/post/user',
    [authJwt.verifyToken, authJwt.isCreatorOrAdmin],
    controller.postsByUser
);

router.get(
    '/post/all',
    controller.findAll
);

router.post(
    '/post',
    [authJwt.verifyToken, authJwt.isCreatorOrAdmin],
    controller.create
);

router.post(
    '/post/comment',
    [authJwt.verifyToken],
    controller.commentCreate
)

router.get(
    '/post/:id',
    controller.findById
)
