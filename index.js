const express = require("express");
const cors = require("cors");
const path = require('path');
const app = express();
var bcrypt = require("bcryptjs");

const corsOptions = {
  origin: "http://localhost:4200"
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// serve attachments folder in static path
app.use('/static',express.static(path.join(__dirname,'attachments')));

const  db = require('./models');
const Roles = db.roles;
const Users = db.users;
//dev environment use {force: true} as param of sync to drop DB and rebuild
db.sequelize.sync({ force: true}) 
  .then(() => {
    console.log("Synced db.");
    initialize();
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to ssde blogs api" });
});

// app.get('/api', (req, res) => {
//   res.json({ message: "this will show the api paths"});
// });
// routes
const auth = require('./routes/auth.routes');//(app);
const user = require('./routes/user.routes');//(app);

app.use('/api', auth);
app.use('/api', user);
// console.log('auth: ',auth);
// console.log('user: ',user);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initialize() {
  Roles.create({ id: 1, name: "user" });
  Roles.create({ id: 2, name: "creator" });
  Roles.create({ id: 3, name: "admin" });

  Users.create({ id: 1, username: 'jorian', firstName: 'Jorge', lastName: 'Rivera', email: 'jorge.rivera@ssde.com.mx', password: bcrypt.hashSync('jorge.rivera', 8) })
    .then( user => { user.setRoles([3]); })
    .catch( err => { console.log('error adding user: ',err); });
  Users.create({ id: 2, username: 'leandro', firstName: 'Leandro', lastName: 'Lima', email: 'leandro.lima@ssde.com.mx', password: bcrypt.hashSync('leandro.lima', 8) })
    .then( user => { user.setRoles([2]); })
    .catch( err => { console.log('error adding user: ',err); });
}