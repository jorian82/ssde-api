const db = require('../models');
const User = db.users;
const Post = db.posts;
const Comm = db.comments;

exports.create = (req, res) => {
    const postData = req.body;
    User.findOne({
        username: postData.username
    }).then( user => {
        Post.create({
            title: postData.title,
            content: postData.content
        }).then( post => {
            post.author = user;
            post.save();
            res.status(200).send({
                message: "success",
                data: post
            });
        }).catch( error => {
            res.status(500).send({
                message: "Error: Post not created",
                error: error
            });
        })
    }).catch( error => {
        res.status(404).send({
            message: "Error: User not found",
            error: error
        });
    });
};

exports.findById = (req, res) => {
    const postId = req.params.id;
    Post.findOne({ "_id":postId}).populate("author").populate("comments")
        .then( post => {
            res.status(200).send({
                message: "success",
                data: post
            });
        })
        .catch(error => {
            res.status(500).send({
                message: "Error: No post with provided id",
                error: error
            });
        });
};

// exports.findAll = (req, res) => {};

exports.findByUser = (req, res) => {
    const userData = req.body;
    Post.find({}).populate('user').populate('comments')
        .then(posts => {
            res.status(200).send({
                message: "success",
                data: posts.filter( post => {
                    post.author.username = userData.username;
                })
            })
        })
        .catch( error => {
            res.status(500).send({
                message: 'Error: No posts for provided user',
                error: error
            })
        });
};

exports.createComment = (req, res) => {
    const body = req.body;
    Post.findOne({"_id": body.postId}).populate('comments')
        .then( post => {
            Comm.create({
                comment: body.comment,
                author: body.userId
            }).then( response => {
                post.comments.push(response);
                post.save();
                res.status(200).send({
                    message: "success",
                    data: post
                });
            }).catch( err => {
                res.status(500).send({
                    message: "Error: Comment not created",
                    error: err
                });
            })
        })
        .catch( err => {
            res.status(500).send({
                message: "Error: No post with provided id",
                error: err
            })
        });
};

exports.findAll = (req, res) => {
    Post.find({}).populate('user').populate('comments')
        .then(posts => {
            res.status(200).send({
                message: "success",
                data: posts
            })
        })
        .catch( error => {
            res.status(500).send({
                message: 'Error: No posts for provided user',
                error: error
            })
        });
};

// exports.update = (req, res) => {};

// exports.delete = (req, res) => {};

// exports.deleteAll = (req, res) => {};
