const clean = require('mongo-clean')
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'

MongoClient.connect(url, { w: 1 }, function (err, client) {
  clean(client.db('yoga_attendance_api_test'), function () {
    console.warn('Your test DB is clean!')
    client.close()
  })
})
