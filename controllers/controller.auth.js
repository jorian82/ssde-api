const db = require("../models");
const config = require("../config/auth.config");
const User = db.users;
const Role = db.roles;
const RefreshToken = db.token;
// const Op = db.Sequelize.Op;
let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
          Role.findOne({ "name": req.body.roles }).then(roles => {
              user.roles.push(roles);
              user.save();
              res.send({ message: "User was registered successfully!" });
          });
      } else {
        // user role = 1
          Role.findOne({"name":"user"}).then(role => {
              user.roles.push(role);
              user.save();
              res.send({ message: "User was registered successfully!" });
          })
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  console.log('request body: ',req.body);
  // db.connect();
  User.findOne({ "username": req.body.username }).populate('roles')
    .then( async (user) => {
        // await user.populate('roles');
        console.log('User found: ', user.username);
        console.log('roles: ', user.roles);
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }
        let passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
        // console.log('password matches: ', passwordIsValid);
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
        // console.log(RefreshToken);
        let refreshToken = await RefreshToken.createToken(user);
        // console.log('refresh token: ',refreshToken);
        let authorities = [];
        user.roles.forEach(role => {
           authorities.push("ROLE_" + role.name);// name.toUpperCase());
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
        console.log('error: ',err);
        res.status(500).send({ message: err.message });
    });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }
  try {
    let refreshToken = await RefreshToken.findOne( {"token": requestToken } );
    // console.log(refreshToken)
    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }
    if (RefreshToken.verifyExpiration(refreshToken)) {
      await RefreshToken.delete( { "_id": refreshToken.id  });
      
      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }
    const user = await refreshToken.user;
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

exports.baseURL = async (req, res) => {
  res.status(200).send("authentication routes");
}