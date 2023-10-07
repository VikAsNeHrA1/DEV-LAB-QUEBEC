require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { ObjectId } = require('mongodb')
const port = process.env.PORT || 5500
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI; 

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const client = new MongoClient(uri, {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', async (req, res) => {
  await client.connect();
  const collection = client.db("barrys-cool-papa-database").collection("dev-profiles");
  let mongoResult = await collection.find().toArray();
  console.log(mongoResult);
  res.render('index', { profileData: mongoResult });
  await client.close();
});

app.post('/updateProfile', async (req, res) => {
  await client.connect();
  const collection = client.db("barrys-cool-papa-database").collection("dev-profiles");
  await collection.findOneAndUpdate(
    { _id: new ObjectId(req.body.devId) },
    { $set: { name: req.body.devName } }
  );
  res.redirect('/');
  await client.close();
});

app.post('/insertProfile', async (req, res) => {
  await client.connect();
  const collection = client.db("barrys-cool-papa-database").collection("dev-profiles");
  await collection.insertOne({ name: req.body.newDevName });
  res.redirect('/');
  await client.close();
});

app.post('/deleteProfile', async (req, res) => {
  await client.connect();
  const collection = client.db("barrys-cool-papa-database").collection("dev-profiles");
  await collection.findOneAndDelete({ _id: new ObjectId(req.body.devId) });
  res.redirect('/');
  await client.close();
});

let myVariableServer = 'soft coded server data';

app.get('/barry', function (req, res) {
  res.render('index', {
    'myVariableClient': myVariableServer
  });
});

app.post('/postClientData', function (req, res) {
  console.log("body: ", req.body);
  console.log("user Name: ", req.body.userName);
  res.render('index', {
    'myVariableClient': req.body.userName
  });
});

app.listen(port, () => console.log(`Server is running...on ${port}`));
