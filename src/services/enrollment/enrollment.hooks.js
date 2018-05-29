const { authenticate } = require('@feathersjs/authentication').hooks
const { alterItems } = require('feathers-hooks-common/lib/services')

const decorateEnrollment = alterItems(async (rec, hook) => {
  const classroom = rec.classroom ? await hook.app.service('classrooms').get(rec.classroom) : { title: 'Aulas regulares' }
  rec.className = classroom.title
  return rec
})

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
    all: [],
    find: [ decorateEnrollment ],
    get: [ decorateEnrollment ],
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
