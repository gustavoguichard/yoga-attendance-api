const { map, filter, toString } = require('lodash')

module.exports = function () {
  return async function (hook) {
    const { app, method, id } = hook

    if(method === 'remove') {
      const result = await app.service('practitioners').find({ query: { family: id } })
      await Promise.all(map(result.data, async person => {
        const family = filter(person.family, _id => toString(_id) !== toString(id))
        return app.service('practitioners').patch(person._id, { family }, { isProcessingFamily: true })
      }))
    }
    return hook
  }
}
