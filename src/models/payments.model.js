// payments-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema, SchemaTypes } = mongooseClient;
  const payments = new Schema({
    total: { type: Number, required: true },
    index: { type: String, required: true },
    note: { type: String },
    paidAt: { type: Date },
    practitionerId: { type: SchemaTypes.ObjectId, ref: 'practitioners', required: true },
    status: { type: String, enum: ['open', 'paid', 'pending', 'confirmed'], required: true, default: 'open' },
    description: {
      enrollmentId: { type: SchemaTypes.ObjectId, ref: 'enrollment' },
      classroom: { type: SchemaTypes.ObjectId, ref: 'classrooms' },
      enrollmentPrice: { type: String },
      date: { type: Date },
      discount: { type: String },
      title: { type: String, required: true },
      value: { type: Number, required: true },
      total: { type: Number, required: true },
      frequented: { type: Number },
      amount: { type: Number },
    },
  }, {
    timestamps: true
  });

  return mongooseClient.model('payments', payments);
};
