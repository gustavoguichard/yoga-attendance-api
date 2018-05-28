const { getTimeRangeQuery } = require('../services/payment/payment.helpers')

module.exports = function () {
  return async function (hook) {
    const { app, data } = hook
    const frequencies = await app.service('frequency').find({
      query: {
        createdAt: getTimeRangeQuery('day', 0, data.createdAt),
        practitionerId: data.practitionerId,
        classId: data.classId,
      }
    })

    if(frequencies.total) {
      hook.result = 'Can not have 2 frequencies at same day'
    }

    return hook
  }
}
