const { authenticate } = require('@feathersjs/authentication').hooks
const permissions = require('../../hooks/permissions')

const checkPermissions = permissions({ roles: ['admin'] })

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: checkPermissions,
    update: checkPermissions,
    patch: checkPermissions,
    remove: checkPermissions,
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  }
}
