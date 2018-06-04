const { get } = require('lodash')
const { authenticate } = require('@feathersjs/authentication').hooks
const { alterItems } = require('feathers-hooks-common/lib/services')
const permissions = require('../../../node_modules/feathers-permissions/lib')
const { populateClassroom } = require('../../hooks/populate')

const decorateEnrollment = alterItems(rec =>
  rec.className = get(rec, 'classroom.title') || 'Aulas regulares'
)

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
    all: [ populateClassroom,  decorateEnrollment ],
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
