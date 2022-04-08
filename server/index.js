const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const path = require('path');
require('dotenv').config({
  path: `${__dirname}\\..\\.env`
});

MongoClient.connect(`${process.env.DB_CONNECT}/edi_db`, (err, client) => {
  if (err) throw err

  const db = client.db('edi_db')

  db.collection('edi_db').find().toArray((err, result) => {
    if (err) throw err

    console.log(`aaa`, result)
  })
});

const app = express();
const port = process.env.PORT || 8080;

// sendFile will go here
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, './../public/index.html'));
});

app.listen(port);
console.log(`Server started at ${process.env.LISTEN_URL}:${port}`);