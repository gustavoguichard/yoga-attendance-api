const { getTimeRangeQuery } = require('../services/payment/payment.helpers')

module.exports = function () {
  return async function (hook) {
    const { app, data } = hook
    const frequencies = await app.service('frequency').find({
      query: {
        createdAt: getTimeRangeQuery('day'),
        practitionerId: data.practitionerId,
        classId: data.classId,
      }
    })

    if(frequencies.total) {
      hook.result = hook.data
    }

    return hook
  }
}
