const { without } = require('lodash')

module.exports = function () {
  return async function (hook) {
    const { app, method, params, id } = hook

    if(params.isProcessingFamily) {
      return hook
    }

    if(method === 'remove') {
      const result = await app.service('practitioners').find({ query: { family: id } })
      if(result.total > 0) {
        await Promise.all(practitioners.map(async person => {
          if(!person.family) {
            return null
          }

          const family = without(person.family, id)
          return app.service('practitioners').patch(person._id, { family }, { isProcessingFamily: true })
        }))
      }
    }
    return hook;
  };
};
