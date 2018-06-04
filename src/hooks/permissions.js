const { intersection } = require('lodash')
const { Forbidden } = require('@feathersjs/errors')

module.exports = function ({ roles, error }) {
  return async function (hook) {
    const { user } = hook.params

    const permitted = user && intersection(user.permissions, roles).length
    hook.params.permitted = hook.params.permitted || permitted

    if (hook.params.provider && error !== false && !hook.params.permitted) {
      throw new Forbidden('You do not have the correct permissions.')
    }

    return hook
  }
}
