const { toString } = require('lodash')

module.exports = function (service, field = 'owner') {
  return async function (hook) {
    const { app, method, params, id } = hook
    const { user } = params

    if (user && user.practitioner && ['update', 'patch', 'remove'].includes(method)) {
      const object = await app.service(service).get(id)
      const isSameId = toString(object[field]) === toString(user.practitioner._id)
      hook.params.permitted = hook.params.permitted || isSameId
    }


    return hook
  }
}
