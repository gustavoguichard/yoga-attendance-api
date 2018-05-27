const { compact } = require('lodash')

module.exports = function () {
  return async function (hook) {
    const { app, method, result, params } = hook
    const frequency = method === 'find' ? result.data : [ result ]
    if(params.populatePractitioners && !!result.total) {
      await Promise.all(frequency.map(async attendance => {
        delete params.populatePractitioners
        attendance.practitioner = await app.service('practitioners').get(attendance.practitionerId, params)
      }))
    }

    return hook;
  };
};
