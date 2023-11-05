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

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to ssde blogs api" });
});

// routes
const auth = require('./routes/auth.routes');//(app);
const user = require('./routes/user.routes');//(app);

app.use('/api', auth);
app.use('/api', user);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

async function initialize() {
  db.connect();
  try {
    console.log('Creating roles')
    let user = null;
    try {
      user = await Roles.create({name: "user"});
    } catch( err ) {
      user = await Roles.findOne({"name":"user"});
    }
    let creator = null;
    try {
      creator = await Roles.create({name: "creator"});
    } catch (e) {
      creator = await Roles.findOne({"name": "creator"});
    }
    let admin = null;
    try {
      admin = await Roles.create({name: "admin"});
    } catch (e) {
      admin = await Roles.findOne({"name":"admin"});
    }

      let userOne = await Users.create({
        username: 'jorian',
        firstName: 'Jorge',
        lastName: 'Rivera',
        email: 'jorge.rivera@ssde.com.mx',
        password: bcrypt.hashSync('jorge.rivera', 8)
      });
      userOne.roles.push(admin);
      await userOne.save();
      let userTwo = await Users.create({
        username: 'leandro',
        firstName: 'Leandro',
        lastName: 'Lima',
        email: 'leandro.lima@ssde.com.mx',
        password: bcrypt.hashSync('leandro.lima', 8)
      });
      userTwo.roles.push(creator);
      await userTwo.save();
      let userThree = await Users.create({
        username: 'user3',
        firstName: 'Dummy',
        lastName: 'UserThree',
        email: 'giorgio1@gmail.com',
        password: bcrypt.hashSync('dummyuser3', 8)
      });
      userThree.roles.push(user);
      await userThree.save();

  } catch (err) {
    console.log('Error initializing the default users', err);
  } finally {
  }
}

initialize().catch(() => console.log('initialization complete'));