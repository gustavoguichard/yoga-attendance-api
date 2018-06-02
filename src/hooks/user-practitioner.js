const { compact, map } = require('lodash')

module.exports = function () {
  return async function (hook) {
    const { app, method, result, params } = hook
    const users = method === 'find' ? result.data : [ result ]

    await Promise.all(map(users, async user => {
      const { email } = user
      const practitioner = (await app.service('practitioners').find({ query: { email } })).data[0]
      if (practitioner) {
        user.practitioner = practitioner
      }
    }))

    return hook
  }
}