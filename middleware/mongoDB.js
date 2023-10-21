require( 'dotenv' ).config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const username = encodeURIComponent(process.env.mongoDB_usr);
const password = encodeURIComponent(process.env.mongoDB_pwd);
const cluster = process.env.mongoDB_cluster;
const uri = `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority`;
// const mongoClient = new MongoClient(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const mongoClient = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await mongoClient.connect();
        // Send a ping to confirm a successful connection
        await mongoClient.db("ssde_blogs");// .listCollections();
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        // await listDatabases(client);
        // await listCollections(mongoClient,"ssde-blogs");
        await addDefaultRoles(mongoClient,"ssde-blogs");
        await addDefaultUsers(mongoClient, "ssde-blogs");

    } finally {
        // Ensures that the client will close when you finish/error
        await mongoClient.close();
    }
}

run().catch(console.dir);

async function connectToCluster(uri) {
    let mongoClient;

    try {
        mongoClient = new MongoClient(uri);
        console.log('Connecting to MongoDB Atlas cluster...');
        await mongoClient.connect();
        console.log('Successfully connected to MongoDB Atlas!');

        await listDatabases(mongoClient);
        await addRoles(mongoClient,"ssde-blogs");

        return mongoClient;
    } catch (error) {
        console.error('Connection to MongoDB Atlas failed!', error);
        process.exit();
    }finally {
        await client.close();
    }
}

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:", databasesList);
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function listCollections(client, db) {
    const database = await  client.db(db);
    const collections = await database.getCollectionNames();

    console.log("Collections: ", collectionsList);
    // collectionsList.collections.forEach(cl => console.log(` - ${cl.name}`));
}

async function addDefaultUsers(client, dbName) {
    const db = client.db(dbName);
    let jorge = {"first": "Jorge", "last": "Rivera", "email": "jorge.rivera@ssde.com.mx", "password": "michel12"};
    let leandro = {"first": "Leandro", "last": "Lima", "email": "giorgio1@gmail.com", "password": "gmailaccount"};

    let admin = await db.collection("roles").findOne({"name": "admin"});
    let creator = await db.collection("roles").findOne({"name": "creator"});

    jorge.role_id=admin._id;
    leandro.role_id=creator._id;

    let users = db.collection("users");

    await users.createIndex( { "email": 1 }, { unique: true } );

    await users.insertMany( [ jorge, leandro ] ).then(console.log("Users added")).catch(err=>console.log("One or more users already exist"));

    let regusers = await users.find();
    // console.log("roles: ",roles);
    await regusers.forEach(item => {
        console.log( 'User: ', item );
    });
}

async function addDefaultRoles(client, dbName) {
    const db = client.db(dbName);

    const admin = { 'name': 'admin' };
    const creator = { 'name': 'creator' };
    const guest = { 'name': 'guest' };

    const collection = db.collection("roles");

    await collection.createIndex( { "name": 1 }, { unique: true });

    await collection.insertOne(admin).catch(err=>console.log('role already exists'));
    await collection.insertOne(creator).catch(err=>console.log('role already exists'));
    await collection.insertOne(guest).catch(err=>console.log('role already exists'));
    await collection.insertOne({ 'name': 'test'}).catch(err=>console.log('role already exists'));

    // await collection.findOneAndReplace( { 'name': 'admin' }, admin );
    // await collection.findOneAndReplace( { 'name': 'creator'}, creator );
    // await collection.findOneAndReplace( { 'name': 'guest'}, guest );
    // await collection.findOneAndReplace( { 'name': 'test'}, { 'name': 'test' });
    // await admqry.forEach()
    // collection.insertOne(admin).then( () => { console.log("admin role added") });

    // collection.findOne( {'name': 'creator'} )
    //     .then( () => {
    //         console.log("Creator user already exist");
    //     } )
    //     .catch( () => {
    //         collection.insertOne(creator).then( () => { console.log("creator role added") });
    //     });
    // collection.findOne( {'name': 'guest'} )
    //     .then( () => {
    //         console.log("Guest user already exist")
    //     })
    //     .catch( () => {
    //         collection.insertOne(guest).then( () => { console.log("Guest role added") });
    //     })

    let roles = await collection.find();
    // console.log("roles: ",roles);
    await roles.forEach(item => {
        console.log( 'role: ', item.name );
    });
}

// connectToCluster(uri).catch(console.dir);

// const { MongoClient } = require("mongodb");
// const username = encodeURIComponent("<username>");
// const password = encodeURIComponent("<password>");
// const cluster = "<clusterName>";
// const authSource = "<authSource>";
// const authMechanism = "<authMechanism>";
// let uri =
//     `mongodb+srv://${username}:${password}@${cluster}/?authSource=${authSource}&authMechanism=${authMechanism}`;
// const client = new MongoClient(uri);
// async function run() {
//     try {
//         await client.connect();
//         const database = client.db("<dbName>");
//         const ratings = database.collection("<collName>");
//         const cursor = ratings.find();
//         await cursor.forEach(doc => console.dir(doc));
//     } finally {
//         await client.close();
//     }
// }
// run().catch(console.dir);