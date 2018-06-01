const { Conflict } = require('@feathersjs/errors')
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
      throw new Conflict('Praticante já está inscrito nesta aula hoje')
    }

    return hook
  }
}
