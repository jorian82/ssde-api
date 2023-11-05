const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.users;

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
  }
  return res.sendStatus(401).send({ message: "Unauthorized!" });
}

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.userId = decoded.id;
    next();
  });
};

hasRole = (req, res, next, ...roleList) => {
  User.findById(req.userId).populate('roles')
      .then( user => {
        user.roles.forEach(role => {
          roleList.forEach( item => {
            if (role.name === item) {
              next();
            }
          });
        });
      })
      .catch( error => {
        console.log("error: ",error);
        res.status(403).send({
          message: `Require ${roleList} Role!`
        });
      });
}

isAdmin = (req, res, next) => {
  hasRole(req, res, next, "admin");
};

isCreator = (req, res, next) => {
  hasRole(req, res, next, "creator");
};

isCreatorOrAdmin = (req, res, next) => {
  hasRole(req,res,next,"admin","creator");
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isCreator: isCreator,
  isCreatorOrAdmin: isCreatorOrAdmin
};

module.exports = authJwt;