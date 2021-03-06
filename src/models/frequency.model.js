// frequency-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = app => {
  const mongooseClient = app.get('mongooseClient')
  const { Schema, SchemaTypes } = mongooseClient
  const frequency = new Schema({
    practitionerId: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: 'practitioners',
    },
    teacher: { type: Boolean, required: true, default: false },
    classId: { type: SchemaTypes.ObjectId, ref: 'classrooms' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  })

  return mongooseClient.model('frequency', frequency)
}
