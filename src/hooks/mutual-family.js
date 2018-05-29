const { compact, filter, map, difference, uniq, toString } = require('lodash')

module.exports = function () {
  return async function (hook) {
    const { app, data, params, result, id, type } = hook

    if(params.isProcessingFamily) {
      return hook
    }

    if(type === 'before') {
      params.oldFamily = []
      if(id) {
        const practitioner = await app.service('practitioners').get(id)
        params.oldFamily = compact(practitioner.family)
      }
    } else {
      const newFamily = compact(map(data.family, toString))
      const searchIn = array => ({ query: { _id: { $in: array } }})

      const removed = await app.service('practitioners').find(searchIn(difference(params.oldFamily, newFamily)))
      const added = await app.service('practitioners').find(searchIn(difference(newFamily, params.oldFamily)))

      removed.data.map(async person => {
        const family = filter(person.family, p => toString(p) !== toString(result._id))
        return app.service('practitioners').patch(person._id, { family }, { isProcessingFamily: true })
      })

      added.data.map(async person => {
        const family = uniq([...person.family, result._id])
        return app.service('practitioners').patch(person._id, { family }, { isProcessingFamily: true })
      })
    }

    return hook
  }
}
