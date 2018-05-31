const { authenticate } = require('@feathersjs/authentication').hooks
const avoidDuplicateFrequency = require('../../hooks/avoid-duplicate-frequency')
const { populatePractitioners, populateClassroom } = require('../../hooks/populate')
const updatePayments = require('../../hooks/update-payments')

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [ avoidDuplicateFrequency() ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [ populateClassroom, populatePractitioners ],
    get: [ populateClassroom, populatePractitioners ],
    create: [ updatePayments() ],
    update: [ updatePayments() ],
    patch: [ updatePayments() ],
    remove: [ updatePayments() ]
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
