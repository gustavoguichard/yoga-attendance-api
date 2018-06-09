const { map } = require('lodash')

module.exports = function () {
  return async function (hook) {
    const { app, method, result } = hook
    const users = method === 'find' ? result.data : [ result ]

    await Promise.all(map(users, async user => {
      const { email } = user
      const practitioner = (await app.service('practitioners').find({ query: { email, $select: ['email', 'picture', 'fullName', 'nickName'] } })).data[0]
      if (practitioner) {
        user.practitioner = practitioner
      }
    }))

    return hook
  }
}
