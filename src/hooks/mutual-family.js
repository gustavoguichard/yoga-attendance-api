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
        params.oldFamily = compact(map(practitioner.family, toString))
      }
    } else {
      const newFamily = compact(map(data.family, '_id'))
      const removed = difference(params.oldFamily, newFamily)
      const added = difference(newFamily, params.oldFamily)

      await Promise.all(removed.map(async _id => {
        const person = await app.service('practitioners').get(_id)
        const family = filter(person.family, p => toString(p) !== toString(result._id))
        return app.service('practitioners').patch(_id, { family }, { isProcessingFamily: true })
      }))

      await Promise.all(added.map(async _id => {
        const person = await app.service('practitioners').get(_id)
        const family = uniq([...person.family, result._id])
        return app.service('practitioners').patch(_id, { family }, { isProcessingFamily: true })
      }))
    }

    return hook;
  };
};
