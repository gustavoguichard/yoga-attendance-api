const { authenticate } = require('@feathersjs/authentication').hooks
const avoidDuplicateFrequency = require('../../hooks/avoid-duplicate-frequency')
const setPractitionerByEmail = require('../../hooks/set-practitioner-by-email')
const updatePayments = require('../../hooks/update-payments')

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [ setPractitionerByEmail(), avoidDuplicateFrequency() ],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
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
