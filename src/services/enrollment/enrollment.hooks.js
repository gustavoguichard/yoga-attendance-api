const { get } = require('lodash')
const { paramsFromClient } = require('feathers-hooks-common')
const { authenticate } = require('@feathersjs/authentication').hooks
const { populateClassroom } = require('../../hooks/populate')
const { alterItems } = require('feathers-hooks-common/lib/services')

const decorateEnrollment = alterItems(rec =>
  rec.className = get(rec, 'classroom.title') || 'Aulas regulares'
)

module.exports = {
  before: {
    all: [ authenticate('jwt'), paramsFromClient('populateClassroom') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [ populateClassroom, decorateEnrollment ],
    get: [ populateClassroom, decorateEnrollment ],
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
