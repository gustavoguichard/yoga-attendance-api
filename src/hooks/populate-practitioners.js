const { compact } = require('lodash')

module.exports = function () {
  return async function (hook) {
    const { app, method, result, params } = hook
    const records = method === 'find' ? result.data : [ result ]
    if(params.populatePractitioners) {
      await Promise.all(records.map(async record => {
        delete params.populatePractitioners
        record.practitioner = await app.service('practitioners').get(record.practitionerId, params)
      }))
    }

    return hook;
  };
};
