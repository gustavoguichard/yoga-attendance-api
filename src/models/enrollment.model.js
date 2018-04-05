// enrollment-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema, SchemaTypes } = mongooseClient;
  const enrollment = new Schema({
    type: { type: String, enum: ['monthly', 'yearly'], required: true, default: 'monthly' },
    pricing: [{
      desc: { type: String, required: true },
      value: { type: Number },
      amount: { type: Number },
    }],
    classroom: { type: SchemaTypes.ObjectId, ref: 'classrooms' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongooseClient.model('enrollment', enrollment);
};
