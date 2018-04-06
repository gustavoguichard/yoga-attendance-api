const { compact, filter, find, includes, join, map, pick, set, values } = require('lodash')

const buildId = (id, details) => {
  const fields = ['enrollmentId', 'enrollmentPrice', 'classroom', 'date', 'title']
  return id + join(compact(values(pick(details, fields))), '-')
}

module.exports = function () {
  return async function (hook) {
    const { app, params } = hook

    if (!params.checkingPayments && (!params.query.months || params.query.months < 1) && params.query.checkPayments) {

      delete params.query.checkPayments

      const savedPayments = await app.service('payments').find({ ...params, checkingPayments: true })

      const savedIndexes = map(savedPayments.data, 'index')
      const openPayments = await app.service('payment-description').find(params)
      const newPayments = map(openPayments, payment => {
        const filtered = filter(payment.paymentDescription.detailing, detailing => {
          const index = buildId(payment._id, detailing)
          return !includes(savedIndexes, index)
        })
        return set(payment, 'paymentDescription.detailing', filtered)
      })

      await Promise.all(newPayments.map(async payment =>
        Promise.all(map(payment.paymentDescription.detailing, detailing => {
          const index = buildId(payment._id, detailing)
          const newPayment = {
            total: 0,
            index,
            practitionerId: payment._id,
            description: detailing,
          }
          return app.service('payments').create(newPayment)
        }))
      ))
    }

    delete params.checkingPayments

    return hook;
  };
};
