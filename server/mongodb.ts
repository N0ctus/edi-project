import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({
  path: `${__dirname}/../.env`
});

MongoClient.connect(`${process.env["DB_CONNECT"]}/${process.env["DB_NAME"]}`, (err, client) => {
  if (err || !client) {
    throw err;
  }

  const db = client.db('edi_db');

  db.collection('edi_db').find().toArray((err, result) => {
    if (err) {
      throw err;
    }

    console.log(`aaa`, result)
  })
});