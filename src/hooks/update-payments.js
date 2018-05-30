const { find, filter, includes, map, toString, uniq } = require('lodash')
const { buildIndex, calculateEnrollment } = require('../services/payments/payments-helpers')

module.exports = function () {
  return async function (hook) {

    const { app, method, result } = hook

    if(!result || !result.classId) {
      return hook
    }

    const classroom = await app.service('classrooms').get(result.classId)
    const index = buildIndex(result, classroom)

    const payments = await app.service('payments').find({
      query: { index, practitionerId: result.practitionerId },
    })

    const isOpen = ({ status }) => includes(['open', 'pending'], status)

    const payment = find(payments.data, d => {
      const isEnrollment = d.description.enrollmentId
      return isOpen(d) || isEnrollment
    })

    if (payment) {
      const shouldRemove = (method === 'remove' || result.teacher)
      const frequented = shouldRemove
        ? filter(payment.frequented, f => toString(f) !== toString(result._id))
        : [ ...payment.frequented, result._id ]

      if (frequented.length) {
        await app.service('payments').patch(payment._id, {
          frequented: uniq(map(frequented, toString)),
          total: (payment.description.enrollmentId ? 1 : frequented.length) * payment.description.total,
        })
      } else {
        await app.service('payments').remove(payment._id)
      }
    } else if(!result.teacher && includes(['create', 'update', 'patch'], method)) {
      const practitioner = await app.service('practitioners')
        .get(result.practitionerId, { populateEnrollments: true })

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

    return hook
  }
}
