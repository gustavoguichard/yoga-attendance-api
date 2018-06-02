const { authenticate } = require('@feathersjs/authentication').hooks
const avoidDuplicateFrequency = require('../../hooks/avoid-duplicate-frequency')
const { populatePractitioner, populateClassroom } = require('../../hooks/populate')
const checkPermissions = require('../../hooks/frequency-permissions')
const updatePayments = require('../../hooks/update-payments')

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [ checkPermissions(), avoidDuplicateFrequency() ],
    update: [ checkPermissions() ],
    patch: [ checkPermissions() ],
    remove: [ checkPermissions() ],
  },

  after: {
    all: [ populateClassroom, populatePractitioner ],
    find: [],
    get: [],
    create: [ updatePayments() ],
    update: [ updatePayments() ],
    patch: [ updatePayments() ],
    remove: [ updatePayments() ],
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
