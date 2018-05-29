const { getTimeRangeQuery } = require('../utils/date-helpers')

module.exports = function () {
  return async function (hook) {
    const { app, data } = hook
    const frequencies = await app.service('frequency').find({
      query: {
        createdAt: getTimeRangeQuery(0, 'day', data.createdAt),
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
