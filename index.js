const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017/edi_db', (err, client) => {
  if (err) throw err

  const db = client.db('edi_db')

  db.collection('edi').find().toArray((err, result) => {
    if (err) throw err

    console.log(result)
  })
})