// payments-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema, SchemaTypes } = mongooseClient
  const payments = new Schema({
    total: { type: Number, required: true, default: 0 },
    index: { type: String, required: true },
    practitionerId: { type: SchemaTypes.ObjectId, ref: 'practitioners', required: true },
    frequented: [{ type: SchemaTypes.ObjectId, ref: 'frequency' }],
    totalPaid: { type: Number, required: true, default: 0 },
    note: { type: String },
    paidAt: { type: Date },
    status: { type: String, enum: ['open', 'paid', 'pending', 'confirmed'], required: true, default: 'open' },
    description: {
      enrollmentId: { type: SchemaTypes.ObjectId, ref: 'enrollment' },
      enrollmentPrice: { type: String },
      amount: { type: Number },
      note: { type: String },
      title: { type: String, required: true },
      discount: { type: String },
      value: { type: Number, required: true },
      total: { type: Number, required: true },
    },
  }, {
    timestamps: true
  })

  return mongooseClient.model('payments', payments)
}
