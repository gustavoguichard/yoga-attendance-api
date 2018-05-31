const { get } = require('lodash')
const { authenticate } = require('@feathersjs/authentication').hooks
const { populateClassroom } = require('../../hooks/populate')
const { alterItems } = require('feathers-hooks-common/lib/services')

const decorateEnrollment = alterItems(rec =>
  rec.className = get(rec, 'classroom.title') || 'Aulas regulares'
)

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [populateClassroom, decorateEnrollment],
    find: [],
    get: [],
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
