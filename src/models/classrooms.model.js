// classrooms-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema, SchemaTypes } = mongooseClient
  const classrooms = new Schema({
    title: { type: String, required: true },
    teacher: { type: SchemaTypes.ObjectId, ref: 'practitioners' },
    practitioners: [{ type: SchemaTypes.ObjectId, ref: 'practitioners' }],
    regularClass: { type: Boolean },
    tuition: { type: Number, required: true },
    schedule: [{
      weekday: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      startTime: { type: Number },
      endTime: { type: Number },
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  })

  return mongooseClient.model('classrooms', classrooms)
}
