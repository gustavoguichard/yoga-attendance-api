const { compact, filter, toString } = require('lodash')

module.exports = function () {
  return async function (hook) {
    const { app, method, result, params } = hook
    const practitioners = method === 'find' ? result.data : [ result ]
    if(params.populateFamily) {

      await Promise.all(practitioners.map(async person => {
        if(!person.family || person.family.length === 0) {
          return null
        }

        delete params.populateFamily

        const family = await Promise.all(person.family.map(
          async id => app.service('practitioners').get(id)
            .then(relative => relative).catch(() => {
              app.service('practitioners').patch(person._id, {
                family: filter(person.family, p => toString(p) !== toString(id))
              })
              return null
            })
        ))

        person.family = compact(family)
      }))
    }

    return hook
  }
}
