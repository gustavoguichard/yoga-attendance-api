const { toString, filter } = require('lodash')

module.exports = function () {
  return async function (hook) {
    const { app, method, params, id } = hook

    if(method === 'remove') {
      const result = await app.service('practitioners').find({ query: { family: id } })
      if(result.total > 0) {
        await Promise.all(result.data.map(async person => {
          const family = filter(person.family, _id => toString(_id) !== toString(id))
          return app.service('practitioners').patch(person._id, { family }, { isProcessingFamily: true })
        }))
      }
    }
    return hook
  }
}
