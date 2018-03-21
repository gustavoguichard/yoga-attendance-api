require('mongoose-type-email')
// practitioners-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { SchemaTypes, Schema } = mongooseClient;
  const practitioners = new Schema({
    user: { type: SchemaTypes.ObjectId, ref: 'users' },
    email: {
      type: String,
      unique: [true, 'This email is already taken'],
      sparse: true,
      trim: true
    },
    fullName: { type: String, required: [true, 'Name is required'] },
    phone: { type: String },
    accessCode: { type: String, required: true, unique: true },
    classRooms: [{ type: SchemaTypes.ObjectId, ref: 'classrooms' }],
    family: [{ type: SchemaTypes.ObjectId, ref: 'practitioners' }],
    birthdate: { type: Date },
    teacher: { type: Boolean, default: false },
    level: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongooseClient.model('practitioners', practitioners);
};

// - userId
// - email: string
// - fullName: string
// - birthdate: date
// - profession: string
// - phone: string
// - facebookId: string
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
