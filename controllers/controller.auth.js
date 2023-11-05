const db = require("../models");
const config = require("../config/auth.config");
const User = db.users;
const Role = db.roles;
const RefreshToken = db.token;
// const Op = db.Sequelize.Op;
let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

let authentication = {};

addRole = (req, res, user, ...roleName) => {
    roleName.forEach( item => {
        Role.findOne({ "name": roleName })
            .then( role => {
                user.roles.push(role);
                user.save();
                res.send({ message: "User was registered successfully!" });
            });
    });
}

authentication.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
          addRole(res, user, req.body.roles);
      } else {
          addRole(res, user, "user");
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

authentication.signin = (req, res) => {
  User.findOne({ "username": req.body.username }).populate('roles')
    .then( async (user) => {
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }
        let passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
        if (!passwordIsValid) {
            return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
            });
        }
        let token = jwt.sign({ id: user.id }, config.secret, {
            // expiresIn: 86400 // 24 hours
            expiresIn: config.jwtExpiration//1200 // 20 minutes
        });
        let refreshToken = await RefreshToken.createToken(user);
        let authorities = [];
        user.roles.forEach(role => {
            authorities.push(role.name.toUpperCase());
        });
        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token,
            refreshToken: refreshToken
        });
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
};

authentication.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }
  try {
    let refreshToken = await RefreshToken.findOne( {"token": requestToken });
    // console.log(refreshToken)
    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }
    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.deleteOne({ "_id": refreshToken._id });
      
      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }
    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });
    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

authentication.baseURL = async (req, res) => {
  res.status(200).send("authentication routes");
}

module.exports = authentication