const { compact } = require('lodash')

module.exports = function () {
  return async function (hook) {
    const { app, method, result, params } = hook
    const frequency = method === 'find' ? result.data : [ result ]
    if(params.populatePractitioners) {
      await Promise.all(frequency.map(async attendance => {
        if(!attendance.practitioners || attendance.practitioners.length === 0) {
          return null
        }
        const practitioners = await Promise.all(
          attendance.practitioners.map(
            async id => app.service('practitioners').get(id, params)
              .then(person => person).catch(e => null)
          )
        )

        attendance.practitioners = compact(practitioners)
      }))
    }

    return hook;
  };
};
