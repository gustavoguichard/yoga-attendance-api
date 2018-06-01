require('mongoose-type-email')
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const { SchemaTypes, Schema } = mongooseClient
  const users = new Schema({
    email: { type: SchemaTypes.Email, sparse: true },
    password: { type: String },
    role: { type: [String] },
    practitionerId : { type: SchemaTypes.ObjectId, ref: 'practitioners' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  })

  return mongooseClient.model('users', users)
}
