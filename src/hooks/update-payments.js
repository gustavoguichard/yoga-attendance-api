const { find, filter, get, map, toString, uniq } = require('lodash')
const { buildIndex, calculateEnrollment } = require('../services/payment/payment.helpers')

module.exports = function () {
  return async function (hook) {

    const { app, method, result, params } = hook

    const classroom = await app.service('classrooms').get(result.classId)
    const index = buildIndex(result, classroom)

    const payments = await app.service('payments').find({
      query: {
        index,
        status: 'open',
        practitionerId: result.practitionerId,
      },
    })

    if (payments.total) {
      const payment = payments.data[0]
      const frequented = (method === 'remove' || result.teacher)
        ? filter(payment.frequented, f => toString(f) !== toString(result._id))
        : [ ...payment.frequented, result._id ]
      await frequented.length
        ? app.service('payments').patch(payment._id, {
          frequented: uniq(map(frequented, toString)),
          total: (payment.description.enrollmentId ? 1 : frequented.length) * payment.description.total,
        })
        : app.service('payments').remove(payment._id)
    } else if(!result.teacher) {
      const practitioner = await app.service('practitioners')
        .get(result.practitionerId, { query: { populateEnrollments: true } })
      const description = calculateEnrollment(practitioner, classroom)

      await app.service('payments').create({
        index,
        description,
        practitionerId: result.practitionerId,
        frequented: [toString(result._id)],
        total: description.total,
        createdAt: result.createdAt,
      })
    }

    const paymentsLog = await app.service('payments').find()

    return hook;
  };
};
