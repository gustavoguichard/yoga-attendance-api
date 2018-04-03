require('mongoose-type-email')
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { SchemaTypes, Schema } = mongooseClient;
  const users = new Schema({

    email: {
      type: SchemaTypes.Email,
      unique: [true, 'This email is already taken']
    },
    password: { type: String },
    picture: { type: String },
    role: { type: [String] },

    googleId: { type: String },

    facebookId: { type: String },
    practitionerId : { type: SchemaTypes.ObjectId, ref: 'practitioners' },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongooseClient.model('users', users);
};
