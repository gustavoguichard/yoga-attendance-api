const mongoose = require('mongoose')

function mongooseClient() {
  const app = this

  mongoose.connect(
    app.get('mongodb'),
    { useNewUrlParser: true },
  )
  mongoose.Promise = global.Promise
  mongoose.set('useCreateIndex', true)

  app.set('mongooseClient', mongoose)
}

module.exports = mongooseClient
