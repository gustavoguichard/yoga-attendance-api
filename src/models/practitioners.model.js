// practitioners-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const { SchemaTypes, Schema } = mongooseClient
  const practitioners = new Schema({
    email: { type: String, trim: true },
    fullName: { type: String, required: [true, 'Name is required'] },
    nickName: { type: String },
    picture: { type: String },
    phone: { type: String },
    accessCode: { type: String, required: true, unique: true },
    classrooms: [{ type: SchemaTypes.ObjectId, ref: 'classrooms' }],
    family: [{ type: SchemaTypes.ObjectId, ref: 'practitioners' }],
    birthdate: { type: Date },
    teacher: { type: Boolean, default: false },
    discount: { type: String },
    enrollments: [{
      enrollmentId: { type: SchemaTypes.ObjectId, ref: 'enrollment' },
      enrollmentPrice: { type: String },
      discount: { type: String },
      note: { type: String },
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  })

  return mongooseClient.model('practitioners', practitioners)
}

// - userId
// - email: string
// - fullName: string
// - birthdate: date
// - profession: string
// - phone: string
// - family: [practitionerId]
// - classes: array
// - accessCode: string
// - discount: {
//     - type: ‘percent’ | ‘subtraction’,
//     - quantity: 30
// - }
// - status: active | inactive
// - teacher: {
//     - classes
//     - level
//     - substitutionAvailability
// - }
