const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const mongo = require('mongodb');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const secret = "mongodb+srv://jtk-admin:joytaka7@cluster0-ecuwk.mongodb.net/test?retryWrites=true&w=majority";
const MongoClient = mongo.MongoClient;
const mongoClient = new MongoClient(secret, {
  reconnectTries: Number.MAX_VALUE,
  autoReconnect: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let client;

mongoClient.connect((err,db) => {
  if(err) console.log(err);
  client = db;
  return client;
});

app.get('/api', async(req, res) => {
  const collection = await client.db('noteworthy').collection('notes');
  console.log('GET RUNNING TO API SPECIFICALLY')

  collection.find().toArray((err, results) => {
    if(err) {
      res.send(err);
      return;
    }

    res.send(results);
  });
});

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());
app.use(serveStatic(path.join(__dirname,"/dist")));

const port = process.env.PORT || 5000;
app.listen(port);
