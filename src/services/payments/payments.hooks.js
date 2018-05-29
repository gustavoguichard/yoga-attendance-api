const { authenticate } = require('@feathersjs/authentication').hooks
const { paramsFromClient } = require('feathers-hooks-common')
const { populatePractitioners } = require('../../hooks/populate')

module.exports = {
  before: {
    all: [ authenticate('jwt'), paramsFromClient('populatePractitioners') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [ populatePractitioners ],
    get: [ populatePractitioners ],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
