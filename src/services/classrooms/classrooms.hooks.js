const { authenticate } = require('@feathersjs/authentication').hooks
const { populateTeacher } = require('../../hooks/populate')
const permissions = require('feathers-permissions')
const normalizeData = require('../../hooks/normalize-data')
const mutualRegularPrice = require('../../hooks/mutual-regular-price')

const checkPermissions = permissions({ roles: ['admin'] })

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [ checkPermissions, normalizeData('classrooms') ],
    update: [ checkPermissions, normalizeData('classrooms') ],
    patch: [ checkPermissions, normalizeData('classrooms') ],
    remove: [ checkPermissions ],
  },

  after: {
    all: [ populateTeacher ],
    find: [],
    get: [],
    create: [ mutualRegularPrice() ],
    update: [ mutualRegularPrice() ],
    patch: [ mutualRegularPrice() ],
    remove: [ ],
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
