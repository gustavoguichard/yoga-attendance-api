// Application hooks that run for every service
const logger = require('./hooks/logger')
const { setNow } = require('feathers-hooks-common')
const { paramsFromClient } = require('feathers-hooks-common')

module.exports = {
  before: {
    all: [ paramsFromClient('populateFamily', 'populateClassroom', 'populatePractitioners') ],
    find: [],
    get: [],
    create: [ setNow('updatedAt') ],
    update: [ setNow('updatedAt') ],
    patch: [ setNow('updatedAt') ],
    remove: []
  },

  after: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
