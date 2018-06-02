const { Forbidden } = require('@feathersjs/errors')
const { get, includes, toString } = require('lodash')

const ERROR = 'You do not have the correct permissions.'
compareIds = (id, id2) => toString(id) === toString(id2)

module.exports = function () {
  return async function (hook) {
    const { app, type, data, id, params: { user } } = hook
    const isAdmin = user && includes(user.permissions, 'admin')
    const userId = get(user, 'practitioner._id')
    let shouldThrow
    if (!user) {
      shouldThrow = true
    } else if (!isAdmin) {
      const isAnotherTeacher = !compareIds(userId, data.practitionerId)
      if (data && data.teacher && isAnotherTeacher) {
        shouldThrow = true
      } else {
        const frequency = await app.services('frequency').get(id)
        if (!compareIds(frequency.practitionerId, userId) && frequency.teacher) {
          shouldThrow = true
        }
      }
    }
    if (shouldThrow) {
      throw new Forbidden(ERROR)
    }

    return hook
  }
}
