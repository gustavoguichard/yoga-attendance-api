const { authenticate } = require('@feathersjs/authentication').hooks
const { populatePractitioner } = require('../../hooks/populate')
const { alterItems } = require('feathers-hooks-common/lib/services')

const decorate = alterItems(rec => {
  rec.regularClass = rec.description.title.includes('Aulas Regulares')
})

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [ populatePractitioner, decorate ],
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
